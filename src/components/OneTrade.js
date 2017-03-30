import React, { Component } from 'react';
import { Link } from 'react-router-dom';
// import '../scss/Game.scss';

import TradeCard from './TradeCard.js';

import RaisedButton from 'material-ui/RaisedButton';

// separating these out since we'll have to add interaction with server
const CancelButton = () => (
  <RaisedButton label='Cancel' />
)
const AcceptButton = () => (
  <RaisedButton label='Accept' primary={true} />
)
const RejectButton = () => (
  <RaisedButton label='Reject' />
)
const ModifyButton = () => (
  <RaisedButton label='Modify' secondary={true} />
)
const CompleteButton = () => (
  <RaisedButton label='Mark Complete' primary={true} />
)

class OneTrade extends Component {
  makeButtons() {
    let userInitiated = this.props.trade.sender.user === this.props.currentUser;
    switch ( this.props.game.status ) {
      case 'pending':
        if (userInitiated) return <CancelButton key='cancel'/>;
        else return null;
      case 'sent':
        if (userInitiated) return <CancelButton key='cancel'/>;
        else return [
          <RejectButton key='reject'/>,
          <ModifyButton key='modify'/>,
          <AcceptButton key='accept'/>
        ];
      case 'accepted':
        return [
          <CancelButton key='cancel'/>,
          <CompleteButton key='complete'/>
        ];
      case 'rejected':    // no interaction
      case 'modified':    // shouldn't even be visible to user
      case 'completed':   // no interaction
        return null;
      default:
        return ( 
          <div className='error' key='error'>Invalid Trade Status</div>
        );
    }
  }
  render() {
    let buttons = this.makeButtons();
    return (
      <div className='trade'>
        <TradeCard trade={this.props.trade} key='card' />
        {buttons}
        <textarea rows='6' cols='50' className='trade-notes' key='notes'>
          {this.props.trade.notes}
        </textarea>
      </div>
    );
  }
}

OneTrade.propTypes = {
  trade: React.PropTypes.object.isRequired,
  user: React.PropTypes.string.isRequired
}

export default OneTrade;