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

const router = require('./routes')(passport);
app.use('/api', router);

const port = process.env.PORT || 3001;
app.listen(port, () => {
  // eslint-disable-next-line
  console.log('listening on port ' + (port));
});
