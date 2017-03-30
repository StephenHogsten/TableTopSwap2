const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const gameSchema = mongoose.Schema({
  "BGG_id": {
    type: String,
    required: [true, 'board game geek ID is required']
  },
  "user": {
    type: String,
    required: [true, 'user is required']
  },
  "sought_or_owned": {
    type: String,
    enum: ['sought', 'owned'],
    default: 'sought'
  },
  "isTradeAccepted": Boolean,
  "BGG_info": {
    "full_image_url": String,
    "thumb_image_url": String,
    "title": String,
    "players_low": Number,
    "players_high": Number,
    "difficulty": Number,
    "minutes_low": Number,
    "minutes_hight": Number
  }
});

export default mongoose.model('trade_game', gameSchema);