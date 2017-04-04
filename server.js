'use strict';

require('dotenv').config();
const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(session);
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const passport = require('passport');

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGO_URI, (err) => {
  // eslint-disable-next-line
  if (err) console.log('mongoose connection error: ' + err);
});

// initialize app
const app = express();

var sessionOptions = {
  secret: process.env.SECRET || 'simplesecret',
  resave: false,
  saveUninitialized: true,
  store: new MongoStore({
    mongooseConnection: mongoose.connection
  })
};
if (process.env.ENV_TYPE === 'PRODUCTION') {
  sessionOptions.cookie = { secure: true };
  app.set('trust proxy', 1);
}

// execute my passport set-up
require('./configurePassport.js')(passport);

app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(session( sessionOptions ));
app.use(passport.initialize());
app.use(passport.session());

// real routes
//  login
app.post('/api/login', passport.authenticate('local', {
  failureRedirect: '/login_failed'
}), (req, res) => {
  // we only get here if successful
  res.redirect('/store_user/' + req.user.username);
});
//  logout
app.get('/api/logout', (req, res) => {
  req.logout();
  res.send('logging out');
});
app.get('/api/checksession', (req, res) => {
  if (req.user) {
    res.send(req.user.username);
  } else {
    res.send('');
  }
})



//send fake data for testing
app.get('/api/test', (req, res) => {
  res.sendFile(process.cwd() + '/garbo/test_games.json');
});
app.get('/api/testTrade', (req, res) => {
  res.sendFile(process.cwd() + '/garbo/test_trades.json');
});
app.get('/api/testSearch/:title', (req, res) => {
  res.sendFile(process.cwd() + '/garbo/test_search.json');
});

//testing auth stuff
// create user
const User = require('./src/models/User.js');
app.get('/api/createuser/:user/:pw', (req, res) => {
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
app.get('/api/isLoggedIn', (req, res) => {
  res.send("authenticated: " + req.isAuthenticated() + ' ' + JSON.stringify(req.user));
});
app.post('/api/logMeIn', passport.authenticate('local', {
  successRedirect: '/proxyme/isLoggedIn',
  failureRedict: '/proxyme/isLoggedIn'
}));
app.get('/api/sendText/:message', (req, res) => {
  res.send(req.params.message);
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  // eslint-disable-next-line
  console.log('listening on port ' + (port));
});
