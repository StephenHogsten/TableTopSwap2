const passport =  require('passport');
const LocalStrategy = require('passport-local').Strategy;

const User = require('./src/models/User.js');

// intended to be called as soon as it's required
module.exports =  (() => {

  // instantiate a new strategy (give it how to authenticate) and tell passport to use it
  passport.use(new LocalStrategy(
    // called to validate a user/password combo
    (username, password, done) => {
      User.findOne({ username: username }, (err, user) => {
        if (err) { return done(err); }
        if (!user) {
          // no user 
          return done(null, false, { message: 'invalid username' });
        }
        if (!user.authenticate(password)) {
          // user exists but password doesn't match
          return done(null, false, { message: 'invalid password' });
        }
        return done(null, user);
      });
    }
  ));

  // show passport how to serialize/deserialize users for using with session
  // ?
  passport.serializeUser( (user, done) => {
    done(null, user.id)
  });
  passport.deserializeUser( (id, done) => {
    User.findById(id, (err, user) => {
      return done(err, user);
    });
  });

});

