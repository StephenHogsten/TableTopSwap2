const express = require('express');
const https = require('https');
const url = require('url');
const xml2js = require('xml2js').parseString;
const util = require('util');

const User = require('./models/User.js');
const Game = require('./models/Game.js');
const Trade = require('./models/Trade.js')

// http helper
const makeRequest = (queryUrl, cb) => {
  queryUrl = url.parse(queryUrl);
  console.log(queryUrl);
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
  console.log(4);
  let titleObj = game.name.find( (val) => val.$.primary ) || game.name[0];
  console.log(5);
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
    console.log(1);
    xml2js(data, (err, gameData) => {
      console.log(2);
      if (err) { cb(err); return; }
      // at this point we have a JSON for the BGG data
      gameData = gameData.boardgames.boardgame;
      console.log(3);
      // now we have an array of games
      result = [];
      for (let gameIdx=0; gameIdx < gameData.length; gameIdx++) {
        result.push(BGG2Game(gameData[gameIdx]));
        console.log('5.1');
      }
      console.log(6);
      cb(null, result);
    });
  });
}

module.exports = (passport) => {

  const router = express.Router();

  //LOGIN
  router.post('/login', passport.authenticate('local', {
    failureRedirect: '/login_failed'
  }), (req, res) => {
    // we only get here if successful
    res.redirect('/store_user/' + req.user.username);
  });
  //  logout
  router.get('/logout', (req, res) => {
    req.logout();
    res.send('logging out');
  });
  router.get('/checksession', (req, res) => {
    if (req.user) {
      res.send({ 
        _id: req.user._id,
        username: req.user.username,
        email: req.user.email,
        join_date: 'n/a',
        picture: null
      });
    } else {
      res.send({ message: 'no active session' });
    }
  });
  router.post('/add_user', (req, res, next) => {
      let newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
      });
      newUser.save( (err) => {
        if (err) { res.send({ error: err }); }
        else {
          next();
        }
      });
    }, passport.authenticate('local', {
        failureRedirect: '/login_failed'
      }), (req, res) => {
        // we only get here if successful
        res.redirect('/store_user/' + req.user.username);
  });

  //BOARD GAME GEEK
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
        console.log(gameData);
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

  //GAME DATABASE
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
    console.log('req.query');
    console.log(req.query);
    console.log('req user _id');
    console.log(req.user._id);
    console.log('sought or owned');
    console.log(req.query.sought);
    console.log(Boolean(req.query.sought)? 'sought': 'owned');
    let user = req.query.user? req.query.user: req.user._id
    queryBggInfo(req.query.id, (err, data) => {
      if (err) { res.send({ error: err }); return; }
      data = data[0];
      let BGGid = data.BGG_id;
      delete data.BGG_id;
      // we should prevent user from creating duplicates
      let game = new Game({
        BGG_id: BGGid,
        user: user,
        sought_or_owned: req.query.issought === 'true'? 'sought': 'owned',
        isTradeAccepted: false,
        BGG_info: data
      });
      game.save((err) => {
        res.send( err? {error: err}: {success: game._id} );
      });
    });
  });
  router.get('/all_games', (req, res) => {
    // is there a way to sort?
    Game.find( {}, (err, games) => {
      if (err) { res.send({ error: err }); return; }
      res.send(games);
    });
  });

  // TRADE DATABASE
  //  expected query parameters:
  //    reciever
  //    sender_owned_game
  //    receiver_owned_game
  //    notes
  //    status (defaults to sent but pending also accepted)
  //  optionally:
  //    sender_sought_game
  //    receiver_sought_game
  router.get('/add_trade', (req, res) => {
    if (!req.isAuthenticated()) { res.send({ error: 'not logged in' }); return; }
    console.log('adding trade');
    console.log(req.query);
    console.log(req.user);
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
    if (req.query.sender_sought_game) trade.sender.sought_game_id = req.query.sender_sought_game;
    if (req.query.receiver_sought_game) trade.receiver.sought_game_id = req.query.receiver_sought_game;
    // could verify games here
    trade.save( (err) => {
      res.send( err? {error: err}: {success: true});
    });
  })
  router.get('/all_trades', (req, res) => {
    console.log('all_trades');
    console.log(req.user);
    Trade.find( {}, (err, trades) => {
      console.log('inside');
      console.log(trades);
      if (err) { res.send({ error: err }); return; }
      res.send(trades);
    })
  });
  // expects query parameters of:
  //  id - trade's id
  //  status - the status we want to assign
  router.get('/set_trade', (req, res) => {
    console.log('setting trade:', req.query);
    if (!req.isAuthenticated()) { res.send({ error: 'not logged in' }); }
    Trade.findById( req.query.id, (err, trade) => {
      if (err) { res.send({ error: 'no trade with that id' }); return; }
      let user = String(req.user._id);
      console.log('user: ' + user + ' ' + user.length);
      console.log('user: ' + typeof(user));
      console.log('trade sender: ' + trade.sender.user + ' ' + trade.sender.user.length);
      console.log('trade recipient: ' + trade.recipient.user);
      console.log('equal? ' + user === trade.sender.user);
      console.log('equal? ' + user.length === trade.sender.user.length);
      switch (req.query.status) {
        case 'accepted':
          if (user !== trade.recipient.user) {
            res.send({ error: 'user is not the recipient' }); return; }
          if (trade.status !== 'sent') {
            res.send({ error: 'can only accept sent trades' }); return; }
          break;
        case 'rejected':
          if (user !== trade.sender.user && user !== trade.recipient.user) {
            res.send({ error: 'user is not part of the trade' }); return; }
          if (trade.status !== 'sent') {
            res.send({ error: 'can only modify sent trades' }); return; }
          break;
        case 'modified':
          if (user !== trade.recipient) { 
            res.send({ error: 'user is not the recipient' }); return }
          if (trade.status !== 'sent') {
            res.send({ error: 'can only modify sent trades' }); return; }
          break;
        case 'sent':
        case 'pending':
        case "cancelled":
        case "completed":
          if (user !== trade.sender.user && user !== trade.recipient.user) {
            res.send({ error: 'user is not part of the trade' }); return; }
          break;
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


  // TESTING
  //send fake data for testing
  router.get('/test', (req, res) => {
    res.sendFile(process.cwd() + '/garbo/test_games.json');
  });
  router.get('/testTrade', (req, res) => {
    res.sendFile(process.cwd() + '/garbo/test_trades.json');
  });
  router.get('/testSearch/:title', (req, res) => {
    res.sendFile(process.cwd() + '/garbo/test_search.json');
  });

  //TESTING
  // create user
  const User = require('./models/User.js');
  router.get('/createuser/:user/:pw', (req, res) => {
    console.log(req.params.user)
    User.create({
      "username": req.params.user,
      "email": 'test123@gmail.com',
      "password": req.params.pw
    }, (err, data) => {
      if (err) console.log(err);
      console.log('hmmm');
      console.log(data);
    }).then(res.send('success?'));
  });
  router.get('/isLoggedIn', (req, res) => {
    res.send("authenticated: " + req.isAuthenticated() + ' ' + JSON.stringify(req.user));
  });
  router.post('/logMeIn', passport.authenticate('local', {
    successRedirect: '/proxyme/isLoggedIn',
    failureRedict: '/proxyme/isLoggedIn'
  }));
  router.get('/sendText/:message', (req, res) => {
    res.send(req.params.message);
  });

  return router;
}