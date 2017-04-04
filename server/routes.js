const express = require('express');
const https = require('https');
const url = require('url');
const xml2js = require('xml2js').parseString;
const util = require('util');

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

const BGG2Game = (game) => {
  let titleObj = game.name.find( (val) => val.$.primary ) || game.name[0];
  return {
    BGG_id: game.$.objectid,
    full_image_url: game.image[0],
    thumb_image_url: game.thumbnail[0],
    title: titleObj._,
    players_low: game.minplayers,
    players_high: game.maxplayers,
    difficulty: game.statistics[0].ratings[0].averageweight,
    rating: game.statistics[0].ratings[0].average,
    minutes_low: game.minplaytime,
    minutes_high: game.maxplaytime,
    description: game.description[0]
  };
}

module.exports = (passport) => {
  const router = express.Router();

  // real routes
  //  login
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
      res.send(req.user.username);
    } else {
      res.send('');
    }
  });

  // expects a 
  router.get('/bggGames/:ids', (req, res) => {
    let searchFor = 'https://www.boardgamegeek.com/xmlapi/boardgame/' +req.params.ids+ '?stats=1'
    makeRequest(searchFor, (err, data) => {
      if (err) res.send('error' + err);
      xml2js(data, (err, gameData) => {
        if (err) res.send('parse error' + err);
        // at this point we have a JSON for the BGG data
        gameData = gameData.boardgames.boardgame;
        // now we have an array of games
        result = [];
        for (let gameIdx=0; gameIdx < gameData.length; gameIdx++) {
          result.push(BGG2Game(gameData[gameIdx]));
        }
        res.send(result);
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