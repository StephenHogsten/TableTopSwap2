const mongoose = require('mongoose');

const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

const gameSchema = Schema({
  "BGG_id": {
    type: Number,
    required: [true, 'board game geek ID is required']
  },
  "user": {
    type: String,
    ref: 'trade_user',
    required: [String, 'user is required']
  },
  "sought_or_owned": {
    type: String,
    enum: ['sought', 'owned'],
    default: 'sought'
  },
  "isTradeAccepted": Boolean,
  "created_date": Date,
  "BGG_info": {
    "full_image_url": String,
    "thumb_image_url": String,
    "title": String,
    "players_low": Number,
    "players_high": Number,
    "difficulty": Number,
    "minutes_low": Number,
    "minutes_hight": Number,
    "description": String,
    "rating": Number
  }
});

gameSchema.pre('save', function (next) {
  if (!this.created_date) {
    this.created_date = new Date();
  }
  next();
});

gameSchema.index({ user: 1, BGG_id: 1, sought_or_owned: 1 }, { unique: true });

module.exports = mongoose.model('trade_game', gameSchema);