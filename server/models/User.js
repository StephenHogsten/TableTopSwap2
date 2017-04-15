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
  "city": String,
  "state": {
    type: String,
    validate: {
      validator: function(v) {
        if (v.length !== 2) return false;
        let stateList ='|AL|AK|AS|AZ|AR|CA|CO|CT|DE|DC|FM|FL|GA|GU|HI|ID|IL|IN|IA|KS|KY|LA|ME|MH|MD|MA|MI|MN|MS|MO|MT|NE|NV|NH|NJ|NM|NY|NC|ND|MP|OH|OK|OR|PW|PA|PR|RI|SC|SD|TN|TX|UT|VT|VI|VA|WA|WV|WI|WY|';
        return stateList.includes('|' + v + '|');
      },
      message: '{VALUE} is not a valid state!'
    },
  },
  "picture": String,
  "email": String,
  "password": {
    type: String,
    validate: [validatePassword, 'Password must be at least ' + passwordMin + ' characters']
  },
  "salt": String
});

userSchema.pre('save', function (next) {
  if (this.password && this.password.length > passwordMin) {
    this.salt = new Buffer(crypto.randomBytes(16).toString('base64'), 'base64');
    this.password = this.hashPassword(this.password);
  }
  next();
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

module.exports = mongoose.model('trade_user', userSchema);