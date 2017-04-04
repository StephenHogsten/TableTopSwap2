const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const gameSchema = mongoose.Schema({
  "BGG_id": {
    type: String,
    required: 'board game geek ID is required'
  },
  "user_owner": {
    type: String,
    required: 'user is required'
  },
  "BGG_info": {
    "image_url": String,
    "title": String,
    "players_low": Number,
    "players_high": Number,
    "Difficulty": Number,
    "Time": String
  }
});

module.exports = mongoose.model('trade_game_away', gameSchema);