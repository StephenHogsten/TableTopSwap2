import React, { Component } from 'react';
import { json as d3Json } from 'd3-request';
// import '../scss/Game.scss';

import TradeCard from './TradeCard.js';

import RaisedButton from 'material-ui/RaisedButton';

// separating these out since we'll have to add interaction with server
const setTrade = (id, status) => {
  d3.request
}
const CancelButton = ({ tradeId }) => (
  <RaisedButton label='Cancel' onTouchTap={() => }/>
);
const AcceptButton = ({ tradeId }) => (
  <RaisedButton label='Accept' primary={true} onTouchTap={onTouchTap} />
);
const RejectButton = ({ tradeId }) => (
  <RaisedButton label='Reject' onTouchTap={onTouchTap} />
);
const ModifyButton = ({ tradeId }) => (
  <RaisedButton label='Modify' secondary={true} onTouchTap={onTouchTap} />
);
const CompleteButton = ({ tradeId }) => (
  <RaisedButton label='Mark Complete' primary={true} onTouchTap={onTouchTap} />
);

const saveStates = {
  'none': 'none',
  'saving': 'saving',
  'error': 'error',
  'done': 'done'
};

class OneTrade extends Component {
  constructor() {
    super();
    this.state = {
      error: null,
      saveState: saveStates.none
    };
  }
  setTrade(status) {
    this.setState({ saveState: savestates.loading });
    let searchFor = '/api/set_trade?id=' + this.props.trade.id + '&status=' + status;
    d3Json(searchFor, (err, data) => {
      if (err) {
        this.setState({ error: err, saveState: saveStates.error });
      } else {
        this.setState({ saveState: savestates.done });
      }
    });
  }
  makeButtons() {
    let userInitiated = this.props.trade.sender.user === this.props.currentUser;
    switch ( this.props.trade.status ) {
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
  componentWillMount() {
    if (this.state.saveState === saveStates.done) {
      history.back();
    }
  }
  render() {
    switch (this.state.saveState) {
      case saveStates.none:
        break;
      case saveStates.loading:
        return <AutoRenewIcon className='loading' />;
      case saveStates.error:
        return <div className='error'>{JSON.stringify(this.state.error)}</div>
      default: 
        return <div className='error'>Invalid save state</div>
    }
    let buttons = this.makeButtons();
    return (
      <div className='trade'>
        <TradeCard trade={this.props.trade} gameList={this.props.gameList} key='card' />
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
  currentUser: React.PropTypes.string.isRequired,
  gameList: React.PropTypes.array.isRequired
}

export default OneTrade;