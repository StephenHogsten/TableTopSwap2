const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const gameSchema = mongoose.Schema({
  "sender": {
    "user": {
      type: String,
      required: [true, 'from user is required']
    },
    "sought_game_id": String,
    "owned_game_id": {
      type: String,
      required: [true, 'offered game is required']
    }
  },
  "recipient": {
    "user": {
      type: String,
      required: [true, 'to user is required']
    },
    "sought_game_id": String,
    "owned_game_id": {
      type: String,
      required: [true, 'requested game is required']
    }
  },
  "notes": String,  // just keeping plain text for now
  "status": {
    type: String,
    enum: [
      'pending',    //requestor is still working on it
      'sent',       //request has sent the request to the recipient
      'accepted',   //recipient has accepted the trade. send emails for details
      'rejected',   //recipient has seen and rejected the trade. send notification to requestor
      'modified',   //recipient has seen and proposed an alternate trade. This results in a new trade request
      'completed'   //trade has actually occurred (just one user needs to say this)
    ],
    required: true
  }
});

module.exports = mongoose.model('trade_request', gameSchema);