'use strict';

require('dotenv').config();
const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(session);
const bodyParser = require('body-parser');

mongoose.Promise = global.Promise;
// mongoose.connect(process.env.MONGO_URI, (err) => {
//   // eslint-disable-next-line
//   if (err) console.log('mongoose connection error: ' + err);
// });

// initialize app
const app = express();

app.use(bodyParser.urlencoded({extended: false}));

// var sessionOptions = {
//   secret: process.env.SECRET,
//   resave: false,
//   saveUninitialized: true,
//   store: new MongoStore({
//     mongooseConnection: mongoose.connection
//   })
// };
// if (process.env.ENV_TYPE === 'PRODUCTION') {
//   sessionOptions.cookie = { secure: true };
//   app.set('trust proxy', 1);
// }

app.get('/api/test', (req, res) => {
  res.sendFile(process.cwd() + '/garbo/test_games.json');
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  // eslint-disable-next-line
  console.log('listening on port ' + (port));
});
