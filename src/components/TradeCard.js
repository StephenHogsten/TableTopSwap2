import React, { Component } from 'react';
import { Link } from 'react-router-dom';
// import '../scss/Game.scss';

import Paper from 'material-ui/Paper';

class TradeCard extends Component {
  render() {
    let trade = this.props.trade;
    let status = trade.status;
    let senderGame = trade.sender.owned_game_id;
    senderGame = this.props.gameList.find( (oneGame) => oneGame._id == senderGame);
    let recipientGame = trade.recipient.owned_game_id;
    recipientGame = this.props.gameList.find( (oneGame) => oneGame._id == recipientGame);
    if (!senderGame || !recipientGame) return (
      <p className='error'>Incorrect Game IDs</p>
    );
    return (
      <Link to={'/trade/' + this.props.trade._id} className='trade-card'>
        <div className={'trade-header trade-status-' + status}>{status}</div>
        <Paper>
          <img src={senderGame.BGG_info.thumb_image_url} alt='main image'/>
          <h4>{senderGame.BGG_info.title}</h4>
          <div>First avatar</div>
          <h4>{senderGame.user}</h4>
        </Paper>
        <div>Arrow Right</div>
        <div>Arrow Left</div>
        <Paper>
          <img src={recipientGame.BGG_info.thumb_image_url} alt='main image'/>
          <h4>{recipientGame.BGG_info.title}</h4>
          <div>Second avatar</div>
          <h4>{recipientGame.user}</h4>
        </Paper>

      </Link>
    );
  }
}

TradeCard.propTypes = {
  trade: React.PropTypes.object.isRequired,
  gameList: React.PropTypes.array.isRequired
}

export default TradeCard;