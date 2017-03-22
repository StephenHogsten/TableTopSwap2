const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const userSchema = mongoose.Schema({
  "id": {
    type: String,
    required: true
  },
  "email": String,
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

export default mongoose.model('trade_user', userSchema);