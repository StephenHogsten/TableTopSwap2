import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import Paper from 'material-ui/Paper';
import CompareArrowsIcon from 'material-ui/svg-icons/action/compare-arrows';

import GameCard from './GameCard';
import '../scss/TradeCard.scss';

class TradeCard extends Component {
  render() {
    let trade = this.props.trade;
    let status = trade.status;
    let senderGame = trade.sender.owned_game_id;
    senderGame = this.props.gameList.find( (oneGame) => oneGame._id == senderGame);   // eslint-disable-line
    let recipientGame = trade.recipient.owned_game_id;
    recipientGame = this.props.gameList.find( (oneGame) => oneGame._id == recipientGame);   // eslint-disable-line
    console.log('sender', senderGame);
    console.log('recip', recipientGame);
    if (!senderGame || !recipientGame) return (
      <p className='error'>Incorrect Game IDs</p>
    );
    return (
      <Link to={'/trade/' + this.props.trade._id}>
        <Paper className='trade-paper'>
          <p className='trade-info-label'>Status: <span className='trade-status-text'>{status}</span></p>
          <div className='trade-paper-row'>
            <GameCard 
              info={senderGame.BGG_info} 
              game_id={senderGame._id} 
              expanded={this.props.expanded}
              onClickFn={ () => null }
              key='sender-card'
            />
            <CompareArrowsIcon key='icon' style={{width:'60px',height:'60px',color:'#555'}}/>
            <GameCard 
              info={recipientGame.BGG_info}
              game_id={recipientGame._id}
              expanded={this.props.expanded}
              onClickFn={ () => null }
              key='recipient-card'
            />
          </div>
          <p className='trade-info-label'>Notes:</p>
          <p className='trade-notes'>{this.props.trade.notes || 'no notes'}</p>
        </Paper>
      </Link>
    );
  }
}

TradeCard.propTypes = {
  trade: React.PropTypes.object.isRequired,
  gameList: React.PropTypes.array.isRequired,
  expanded: React.PropTypes.bool
}

export default TradeCard;