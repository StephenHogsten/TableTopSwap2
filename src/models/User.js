const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const crypto = require('crypto');

const passwordMin = 8;
const validatePassword = (password) => {
  console.log('validating password...');
  return (password && password.length >= passwordMin);
}


const userSchema = mongoose.Schema({
  "username": {
    type: String,
    trim: true,
    unique: true,
    required: true
  },
  "email": String,
  "password": {
    type: String,
    validate: [validatePassword, 'Password must be at least ' + passwordMin + ' characters']
  },
  "salt": String
});

userSchema.pre('save', function (next) {
  console.log('saving user...');
  if (this.password && this.password.length > passwordMin) {
    console.log('we\'re in');
    this.salt = new Buffer(crypto.randomBytes(16).toString('base64'), 'base64');
    console.log('salt:' + this.salt);
    this.password = this.hashPassword(this.password);
    console.log('password:' + this.password);
  }
  next();
});

userSchema.methods.hashPassword = function(password) {
  console.log('hashing password...');
  if (this.salt && password) {
    return crypto.pbkdf2Sync(password, this.salt, 100000, 64, 'sha512').toString('base64');
  } else {
    // are we doing this so that empty passwords are invalid?
    return password;
  }
}

userSchema.methods.authenticate = function(password) {
  console.log('authenticating...');
  //     real hashPasswod       compare to hash of provided password
  return this.password === this.hashPassword(password);
}

module.exports = mongoose.model('trade_user', userSchema);