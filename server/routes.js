const express = require('express');
const https = require('https');
const url = require('url');
const xml2js = require('xml2js').parseString;

const User = require('./models/User.js');
const Game = require('./models/Game.js');
const Trade = require('./models/Trade.js')

// http helper
const makeRequest = (queryUrl, cb) => {
  queryUrl = url.parse(queryUrl);
  let options = {
    protocol: 'https:',
    hostname: queryUrl.hostname,
    path: queryUrl.path,
    method: 'GET'
  };
  let response = [];
  var req = https.request(options, (res) => {
    if (res.statusCode !== 200) {
      cb(null, { "status_code": res.statusCode });
      return;
    }
    res.on('data', (chunk) => {
      response.push(chunk.toString());
    });
    res.on('end', () => {
      cb(null, response.join(''));
    });
  });
  req.end();
}

const firstIdx = (game, prop) => {
  return game[prop]? game[prop][0]: null;
}

const BGG2Game = (game) => {
  let titleObj = game.name.find( (val) => val.$.primary ) || game.name[0];
  return {
    BGG_id: game.$.objectid,
    full_image_url: firstIdx(game, 'image'),
    thumb_image_url: firstIdx(game, 'thumbnail'),
    title: titleObj._,
    players_low: firstIdx(game, 'minplayers'),
    players_high: firstIdx(game, 'maxplayers'),
    difficulty: game.statistics[0].ratings[0].averageweight[0],
    rating: game.statistics[0].ratings[0].average[0],
    minutes_low: firstIdx(game, 'minplaytime'),
    minutes_high: firstIdx(game, 'maxplaytime'),
    description: firstIdx(game, 'description')
  };
}

const queryBggInfo = (ids, cb) => {
  let searchFor = 'https://www.boardgamegeek.com/xmlapi/boardgame/' + ids + '?stats=1';
  makeRequest(searchFor, (err, data) => {
    if (err) { cb(err); return; }
    xml2js(data, (err, gameData) => {
      if (err) { cb(err); return; }
      // at this point we have a JSON for the BGG data
      gameData = gameData.boardgames.boardgame;
      // now we have an array of games
      let result = [];
      for (let gameIdx=0; gameIdx < gameData.length; gameIdx++) {
        result.push(BGG2Game(gameData[gameIdx]));
      }
      cb(null, result);
    });
  });
}

function newGame(BGG_id, isSought, user, cb) {
  queryBggInfo(BGG_id, (err, data) => {
      if (err) { cb(err); return; }
      data = data[0];
      let BGGid = data.BGG_id;
      delete data.BGG_id;
      // we should prevent user from creating duplicates
      let game = new Game({
        BGG_id: BGGid,
        user: user,
        sought_or_owned: isSought? 'sought': 'owned',
        isTradeAccepted: false,
        BGG_info: data
      });
      game.save((err) => {
        cb(err, game);
      });
    });
}

module.exports = (passport) => {

  const router = express.Router();

  //USER ROUTES
  //  login user
  router.post('/login', function(req, res, next) {
    // use passport to authenticate
    passport.authenticate('local', function(err, user, info) {
      if (err) { return next(err); }
      if (!user) { return next(info); }
      req.logIn(user, function(err) {
        if (err) { return next(err); }
        return res.redirect('/logged_in')
      });
    })(req, res, next);
  }, (error, req, res, next) => {
    // send error message to client
    return res.redirect('/login/' + encodeURIComponent(JSON.stringify(error)));
  });
  // logout
  router.get('/logout', (req, res) => {
    req.logout();
    res.send('logging out');
  });
  // check for active session
  router.get('/checksession', (req, res) => {
    console.log('req.user', req.user);
    if (req.user) {
      res.send({ 
        activeSession: true,
        _id: req.user._id,
        username: req.user.username
      });
    } else {
      res.send({ activeSession: false, message: 'no active session' });
    }
  });
  // return user details
  router.get('/user/:id', (req, res) => {
    if (!req.params.id) {
      res.send({ error: 'no user id supplied' });
      return;
    }
    User.findById(req.params.id, (err, user) => {
      if (err) res.send({ error: err });
      else { res.send({ 
        username: user.username,
        email: user.email,
        join_date: user.join_date,
        picture: user.picture,
        city: user.city,
        state: user.state
      }); }
    });
  });
  // update a user
  //   expects query parameters of either state or city or both
  router.get('/update_user/:id', (req, res) => {
    let updateObj = {};
    let noUpdates = true;
    if (req.query.state) {
      updateObj.state = req.query.state;
      noUpdates = false;
    }
    if (req.query.city) {
      updateObj.city = req.query.city;
      noUpdates = false;
    }
    if (noUpdates) { return res.send({error: 'no data changed'}); }
    User.update(
      { _id: req.params.id },
      { $set: updateObj },
      (err) => res.send( err? {error: err}: {result: 'success'})
    );
  });
  // create new user
  router.post('/add_user', (req, res, next) => {
      let newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
      });
      newUser.save( (err) => {
        if (err) { 
          // err - send the user back to login 
          let message;
          if (err.code === 11000) { message = 'username already taken' }
          else if (err.errors.hasOwnProperty('password') && err.errors.password.message === 'Password must be at least 8 characters') {
            message = 'password must be at least 8 characters';
          } else { message = 'unable to create user'; }
          res.redirect('/login/' + encodeURIComponent(JSON.stringify({
            message: message
          })));
        }  else {
          next();
        }
      });
    }, passport.authenticate('local', {
        failureRedirect: '/login_failed'
      }), (req, res) => {
        // we only get here if successful
        res.redirect('/store_user/' + req.user.username);
  });

  //BOARD GAME GEEK ROUTES
  // get detailed info
  // expects comma delimited ids to get BGG info for
  router.get('/bggGames/:ids', (req, res) => {
    queryBggInfo(req.params.ids, (err, data) => {
      if (err) res.send({ error: err });
      else res.send(data);
    });
  });
  // search for game title
  router.get('/bggSearch/:query', (req, res) => {
    let searchFor = 'https://www.boardgamegeek.com/xmlapi/search?search=' + req.params.query;
    makeRequest(searchFor, (err, data) => {
      if (err) res.send({'error': err});
      xml2js(data, (err, gameData) => {
        gameData = gameData.boardgames.boardgame;
        if (!gameData) {res.send([]);}
        else {
          let results = gameData.map( (val) => {
            let name = val.name[0];
            let year = val.yearpublished? val.yearpublished[0]: 'none'
            return {
              id: val.$.objectid,
              year: year,
              title: (typeof(name) === 'string')? name: name._
            }
          });
          res.send(results);
        }
      });
    });
  });

  //GAME DATABASE ROUTES
  // add game expects query parameters:
  //  id (number - BGG game id)
  //  issought (bool)
  //  user (optional)
  router.get('/add_game', (req, res) => {
    if (!req.isAuthenticated()) {
      res.send('not logged in');
      return;
    }
    if (!req.user) {
      res.send('no valid user session');
      return;
    }
    let user = req.query.user? req.query.user: req.user._id
    newGame(req.query.id, req.query.issought === 'true', user, (err, game) => {
      res.send( err? {error: err}: {success: game._id});
    });
  });
  // return all game info
  router.get('/all_games', (req, res) => {
    Game
      .find({})
      .sort({ created_date: -1 })
      .populate('user', {
        _id: true,
        username: true,
        picture: true,
        city: true,
        state: true
      })
      .exec( (err, games) => {
        if (err) { res.send({ error: err }); return; }
        res.send(games);
      });
  });

  // TRADE DATABASE ROUTES
  //  create new trade
  //   expected query parameters:
  //     reciever
  //     sender_owned_game
  //     receiver_owned_game
  //     notes
  //     status (defaults to sent but pending also accepted)
  //   optionally:
  //     receiver_owned_BGG_id
  //     sender_sought_game
  //     receiver_sought_game
  router.get('/add_trade', (req, res) => {
    if (!req.isAuthenticated()) { res.send({ error: 'not logged in' }); return; }
    let trade = new Trade({
      sender: {
        user: req.user._id,
        owned_game_id: req.query.sender_owned_game
      },
      recipient: {
        user: req.query.receiver,
        owned_game_id: req.query.receiver_owned_game
      },
      notes: decodeURIComponent(req.query.notes),
      status: req.query.status || 'sent'
    });
    if (req.query.receiver_sought_game) trade.recipient.sought_game_id = req.query.receiver_sought_game;
    if (!req.query.sender_sought_game && req.query.receiver_owned_BGG_id) {
      newGame(req.query.receiver_owned_BGG_id, true, req.user._id, (err, game) => {
        if (err) {res.send({error: err}); return; }
        trade.sender.sought_game_id = game._id;
        trade.save( (err) => {
          res.send( err? {error: err}: {success: true});
        });
      });
    } else {
      trade.sender.sought_game_id = req.query.sender_sought_game;
      trade.save( (err) => {
        res.send( err? {error: err}: {success: true});
      });
    }
  });
  // retrieve all trades
  router.get('/all_trades', (req, res) => {
    Trade.find({})
      .sort({'created_date': -1})
      .exec((err, trades) => {
        if (err) { res.send({ error: err }); return; }
        res.send(trades);
      });
  });
  // update a trade's status
  //  expects query parameters of:
  //     id - trade's id
  //     status - the status we want to assign
  //   optionally: 
  //     receiver_sought_game
  //     sender_owned_BGG_id
  router.get('/set_trade', (req, res) => {
    if (!req.isAuthenticated()) { res.send({ error: 'not logged in' }); }
    Trade.findById( req.query.id, (err, trade) => {
      if (err) { res.send({error: err}); return; }
      if (!trade) { res.send({ error: 'no trade with that id' }); return; }
      let user = String(req.user._id);
      // different checks for differet attempted statuses
      switch (req.query.status) {
        case 'accepted':
          if (user !== trade.recipient.user) {
            res.send({ error: 'user is not the recipient' }); return; }
          if (trade.status !== 'sent') {
            res.send({ error: 'can only accept sent trades' }); return; }
          if (trade.recipient.sought_game_id) {
            // we already have a recipient sought game, save normally
            break;
          } else {
            // we need to link to or add a reciepient sought game 
            if (req.query.receiver_sought_game) {
              // they must've created a sought game in between - link together
              trade.recipient.sought_game_id = req.query.receiver_sought_game;
              break;
            }
            if (!req.query.sender_owned_BGG_id) {
              res.send({ error: 'no sender game BGG id'}); return; 
            }
            // they've accepted, so we'll create a sought game for them
            newGame(req.query.sender_owned_BGG_id, true, trade.recipient.user, (err, game) => {
              if (err) { res.send({ error: err}); return; }
              trade.recipient.sought_game_id = game._id;
              trade.status = req.query.status;
              trade.save( (err) => {
                res.send(err? {error: err}: {success: true});
              });
            });
            return;
          }
        case 'rejected':
          if (user !== trade.sender.user && user !== trade.recipient.user) {
            res.send({ error: 'user is not part of the trade' }); return; }
          if (trade.status !== 'sent') {
            res.send({ error: 'can only modify sent trades' }); return; }
          break;
        case 'modified':
          if (user !== trade.recipient.user) { 
            res.send({ error: 'user is not the recipient' }); return }
          if (trade.status !== 'sent') {
            res.send({ error: 'can only modify sent trades' }); return; }
          break;
        case 'sent':
        case 'pending':
        case "cancelled":
          break;
        case "completed":
          if (user !== trade.sender.user && user !== trade.recipient.user) {
            res.send({ error: 'user is not part of the trade' }); return; }
          trade.status = req.query.status;
          trade.save( (err) => {
            if (err) { res.send({ error: err }); return; }
            res.send({message: 'success'});
            // trade saved successfully - mark the games as traded
            let games = [
              trade.sender.sought_game_id,
              trade.sender.owned_game_id,
              trade.recipient.sought_game_id,
              trade.recipient.owned_game_id
            ];
            for (let gameId of games) {
              Game.update(
                { _id: gameId },
                { $set: { isTradeAccepted: 'true' } },
                (err) => console.log(err? err: ('updated game: ' + gameId))   // eslint-disable-line
              );
            }
          });
          return;
        default:
          res.send({ error: 'new status is not a valid option' }); return;
      }
      // if we made it here, we should be modifying the trade
      trade.status = req.query.status;
      trade.save( (err) => {
        res.send(err? {error: 'trade did not save successfully'}: {success: true});
      });
    });
  });

  return router;
}