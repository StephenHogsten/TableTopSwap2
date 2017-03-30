import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import FloatingActionButton from 'material-ui/FloatingActionButton';

import TradeCard from './TradeCard.js';

class TradeList extends Component {
  render() {
    let trades = [];
    this.props.tradeList.forEach( (oneTrade) => {
      trades.push(
        <TradeCard trade={oneTrade} key={oneTrade._id} gameList={this.props.gameList}/>
      );
    });
    if (trades.length === 0) trades = <p className='error'>No current trades</p>
    
    // display each section that should exist for the user
    return (
      <div className='trade-list'>
        <div className='trade-holder'>{trades}</div>
        <Link to='new_trade'><FloatingActionButton /></Link>
      </div>
    );
  }
}

TradeList.propTypes = {
  // undecided
  currentUser: React.PropTypes.string,
  tradeList: React.PropTypes.array,
  gameList: React.PropTypes.array.isRequired
}

export default TradeList;