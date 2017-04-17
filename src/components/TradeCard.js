import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import Paper from 'material-ui/Paper';
import CompareArrowsIcon from 'material-ui/svg-icons/action/compare-arrows';

import GameCard from './GameCard';
import '../scss/TradeCard.scss';

class TradeCard extends Component {
  getStatusStyle(status, isCurrentUserSender) {
    let color;
    switch (status) {
      case 'completed':
        color = 'green'; break;
      case 'modified':
      case 'cancelled':
      case 'rejected':
        color = 'gray'; break;
      case 'accepted':
        color = 'green'; break;
      case 'sent':
      case 'received':
        color = isCurrentUserSender? 'blue': 'yellow';
        break;
      default:
        color = 'pink'  // this shouldn't ever happen
    }
    return {
      borderLeft: 'solid 4px ' + color,
      padding: '16px'
    };
  }
  addPadding(style, padding) {
    let newStyle = {};
    Object.assign(newStyle, style);
    newStyle.padding = (padding || 8) + 'px';
    return newStyle;
  }
  renderBody() { 
    // set-up variables needed for rendering
    let trade = this.props.trade;
    let status = trade.status;
    if (status === 'sent' && trade.recipient.user === this.props.currentUser) {
      status = 'received';      // should be received to recipient if sent
    }
    let senderGame = trade.sender.owned_game_id;
    senderGame = this.props.gameList.find( (oneGame) => oneGame._id == senderGame);   // eslint-disable-line
    let recipientGame = trade.recipient.owned_game_id;
    recipientGame = this.props.gameList.find( (oneGame) => oneGame._id == recipientGame);   // eslint-disable-line
    if (!senderGame || !recipientGame) return (
      <p className='error'>Incorrect Game IDs</p>
    );
    let colorStyle = this.getStatusStyle(status, senderGame.user._id === this.props.currentUser);

    console.log('trade', trade);
    console.log('trade date', trade.created_date);
    console.log(new Date(trade.created_date));
    console.log((new Date(trade.created_date)).toLocaleDateString());
    // return the body
    return (
      <Paper 
        className={this.props.isExpanded? 'trade-paper-expanded': 'trade-paper'}
        style={colorStyle}
      >
        <p className='trade-info-label' key='date'>
          Created: <span className='trade-info-text'>{(new Date(trade.created_date)).toLocaleDateString()}</span>
        </p> 
        {!this.props.isExpanded? null : [
          <p className='trade-info-label' style={this.addPadding(colorStyle, 4)} key='status'>
            Status: <span className='trade-info-text'>{status}</span>
          </p>,,
          <p className='trade-info-label' key='note-label'>Notes:</p>,
          <p className='trade-notes' key='note'>{this.props.trade.notes || 'no notes'}</p>
        ]}
        <div className='trade-paper-row'>
          <GameCard 
            game={senderGame}
            isExpanded={this.props.isExpanded}
            onClickFn={ () => null }
            key='sender-card'
          />
          <CompareArrowsIcon key='icon' style={{width:'60px',height:'60px',color:'#555'}}/>
          <GameCard 
            game={recipientGame}
            isExpanded={this.props.isExpanded}
            onClickFn={ () => null }
            key='recipient-card'
          />
        </div>
      </Paper>
    );
  }
  render() {
    // wrap the render body in a link if not expanded
    return (this.props.isExpanded)? (
      this.renderBody()
    ) : (
      <Link to={this.props.isExpanded? '': '/trade/' + this.props.trade._id}>
        {this.renderBody()}
      </Link>
    );
  }
}

TradeCard.propTypes = {
  currentUser: React.PropTypes.string.isRequired,
  isExpanded: React.PropTypes.bool,
  trade: React.PropTypes.object.isRequired,
  gameList: React.PropTypes.array.isRequired,
}

export default TradeCard;