const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const gameSchema = mongoose.Schema({
  "BGG_id": {
    type: String,
    required: 'board game geek ID is required'
  },
  "user": {
    type: String,
    required: 'user is required'
  },
  "sought": Boolean,
  "BGG_info": {
    "image_url": String,
    "title": String,
    "players_low": Number,
    "players_high": Number,
    "Difficulty": Number,
    "Time": String
  }
});

export default mongoose.model('trade_game', gameSchema);