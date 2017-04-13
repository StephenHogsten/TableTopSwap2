import React, { Component } from 'react';
import { json as d3Json } from 'd3-request';
// import '../scss/OneTrade.scss';

import TradeCard from './TradeCard.js';

import RaisedButton from 'material-ui/RaisedButton';
// import AutoRenewIcon from 'material-ui/svg-icons/action/autorenew';

// separating these out since we'll have to add interaction with server

const CancelButton = ({ onTouchTap }) => (
  <RaisedButton className='trade-button' label='Cancel' onTouchTap={() => onTouchTap('cancelled')}/>
);
const AcceptButton = ({ onTouchTap, trade, bggId }) => (
  <RaisedButton className='trade-button' label='Accept' primary={true} onTouchTap={() => onTouchTap('accepted')} />
);
const RejectButton = ({ onTouchTap }) => (
  <RaisedButton className='trade-button' label='Reject' onTouchTap={() => onTouchTap('rejected')} />
);
// need to redirect to create new trade w/ defaults
const ModifyButton = ({ onTouchTap }) => (
  <RaisedButton className='trade-button' label='Modify' secondary={true} onTouchTap={() => onTouchTap('modified')} />
);
const CompleteButton = ({ onTouchTap }) => (
  <RaisedButton className='trade-button' label='Mark Complete' primary={true} onTouchTap={() => onTouchTap('completed')} />
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
    console.log('setting status: ', status);
    this.setState({ saveState: saveStates.loading });
    let searchFor = '/api/set_trade?id=' + this.props.trade._id + '&status=' + status;
    d3Json(searchFor, (err, data) => {
      if (err) {
        this.setState({ error: err, saveState: saveStates.error });
      } else {
        if (data.hasOwnProperty('error')) {
          this.setState({ error: data.error, saveState: saveStates.error });
        } else {
          console.log('data', data);
          this.setState({ saveState: saveStates.done });
        }
      }
    });
  }
  makeButtons() {
    let userInitiated = this.props.trade.sender.user === this.props.currentUser;
    switch ( this.props.trade.status ) {
      case 'pending':
        if (userInitiated) return <CancelButton key='cancel' onTouchTap={a => this.setTrade(a)} />;
        else return null;
      case 'sent':
        if (userInitiated) return <CancelButton key='cancel' onTouchTap={a => this.setTrade(a)} />;
        else return [
          <RejectButton key='reject' onTouchTap={a => this.setTrade(a)} />,
          <ModifyButton key='modify' onTouchTap={a => this.setTrade(a)} />,
          <AcceptButton key='accept' onTouchTap={a => this.setTrade(a)} />
        ];
      case 'accepted':
        return [
          <CancelButton key='cancel' onTouchTap={a => this.setTrade(a)} />,
          <CompleteButton key='complete' onTouchTap={a => this.setTrade(a)} />
        ];
      case 'rejected':    // no interaction
      case 'modified':    // shouldn't even be visible to user
      case 'cancelled':   // no interaction
      case 'completed':   // no interaction
        return null;
      default:
        return ( 
          <div className='error' key='error'>Invalid Trade Status</div>
        );
    }
  }
  componentWillUpdate(nextProps, nextState) {
    if (nextState.saveState === saveStates.done) {
      this.props.refreshTrades();
      history.back();
    }
  }
  render() {
    // switch (this.state.saveState) {
    //   case saveStates.none:
    //     break;
    //   case saveStates.done:
    //     console.log('we\'re done');
    //   case saveStates.saving:
    //     return <AutoRenewIcon className='loading' />;
    //   case saveStates.error:
    //     return <div className='error'>{JSON.stringify(this.state.error)}</div>
    //   default: 
    //     return <div className='error'>Invalid save state</div>
    // }
    let buttons = this.makeButtons();
    return (
      <div className='trade'>
        <TradeCard 
          currentUser={this.props.currentUser}
          trade={this.props.trade} 
          gameList={this.props.gameList} 
          key='card' 
          expanded={true}
        />
        {buttons}
      </div>
    );
  }
}

OneTrade.propTypes = {
  refreshTrades: React.PropTypes.func.isRequired,
  trade: React.PropTypes.object.isRequired,
  currentUser: React.PropTypes.string.isRequired,
  gameList: React.PropTypes.array.isRequired
}

export default OneTrade;