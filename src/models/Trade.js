const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const gameSchema = mongoose.Schema({
  "seeking_BGG_id": {
    type: String,
    required: 'board game geek ID is required'
  },
  "for_BGG_id": {
    type: String,
    required: 'board game geek ID is required'
  },
  "user_seeking": {
    type: String,
    required: 'from user is required'
  },
  "user_owner": {
    type: String,
    required: 'to user is required'
  },
  "seeking_BGG_info": {
    "image_url": String,
    "title": String,
    "players_low": Number,
    "players_high": Number,
    "Difficulty": Number,
    "Time": String
  },
  "for_BGG_info": {
    "image_url": String,
    "title": String,
    "players_low": Number,
    "players_high": Number,
    "Difficulty": Number,
    "Time": String
  },
  status: {
    // we want to restrict to 
    //  pending   requestor is still working on it
    //  sent      request has sent the request to the recipient
    //  accepted  recipient has accepted the trade. send emails for details
    //    completed?
    //  rejected  recipient has seen and rejected the trade. send notification to requestor
    //  modified  recipient has seen and proposed an alternate trade. This results in a new trade request
    type: String,
    required: true
  }
});

export default mongoose.model('trade_request', gameSchema);