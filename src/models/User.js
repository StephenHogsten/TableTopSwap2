const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const crypto = require('crypto');

const passwordMin = 8;
const validatePassword = (password) => {
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
  "salt": String,
  "games_to_trade_away": [String],
  "games_to_trade_for": [String],
  "completed trades": [
    {
      "lost": {
        "title": String,
        "image_url": String
      },
      "gained": {
        "title": String,
        "image_url": String
      }
    }
  ]
});

userSchema.pre('save', function (next) {
  if (this.password && this.password.length > passwordMin) {
    this.salt = new Buffer(crypto.randomBytes(16).toString('base64'), 'base64');
    this.password = this.hashPassword(this.password);
  }
});

userSchema.methods.hashPassword = function(password) {
  if (this.salt && password) {
    return crypto.pbkdf2Sync(password, this.salt, 100000, 64, 'sha512').toString('base64');
  } else {
    // are we doing this so that empty passwords are invalid?
    return password;
  }
}

userSchema.methods.authenticate = function(password) {
  //     real hashPasswod       compare to hash of provided password
  return this.password === this.hashPassword(password);
}

export default mongoose.model('trade_user', userSchema);