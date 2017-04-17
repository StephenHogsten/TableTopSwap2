import React, { Component } from 'react';
import { json as d3Json } from 'd3-request';
import { Redirect } from 'react-router-dom';
// import '../scss/OneTrade.scss';

import TradeCard from './TradeCard.js';
import Loading from './Loading.js';

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
  'done': 'done',
  'modify': 'modify'
};

class OneTrade extends Component {
  constructor(props) {
    super();
    // put the games and IDs in state
    let senderOwnedGameId = props.trade.sender.owned_game_id;
    let senderOwnedGame = props.gameList.find( game => game._id === senderOwnedGameId );
    let recipientOnwedGameId = props.trade.recipient.owned_game_id;
    let recipientOwnedGame = props.gameList.find( game => game._id === recipientOnwedGameId );
    this.state = {
      error: (!recipientOwnedGame || !senderOwnedGame)? 'Games not found': '',
      saveState: (!recipientOwnedGame || !senderOwnedGame)? saveStates.error: saveStates.none,
      senderOwnedGame: senderOwnedGame,
      recipientOwnedGame: recipientOwnedGame
    };
  }
  setTrade(status) {
    this.setState({ saveState: saveStates.saving });
    let searchFor = '/api/set_trade?id=' + this.props.trade._id + '&status=' + status;
    if (!this.props.trade.recipient.sought_game_id) {
      // we need to link or create a recipient sought game
      let recipientUser = this.props.trade.recipient.user;
      let recipientGame = this.props.gameList.find( (game) => (
        game.BGG_id === this.state.senderGame.BGG_id && game.user._id === recipientUser && game.sought_or_owned === 'sought'
      ));
      if (recipientGame) {
        searchFor += '&receiver_sought_game=' + recipientGame._id;
      } else {
        searchFor += '&sender_owned_BGG_id=' + this.state.senderGame.BGG_id;
      }
    }
    d3Json(searchFor, (err, data) => {
      if (err) {
        this.setState({ error: err, saveState: saveStates.error });
      } else {
        if (data.hasOwnProperty('error')) {
          this.setState({ error: data.error, saveState: saveStates.error });
        } else {
          if (status === 'modified') {
            this.setState({ saveState: saveStates.modify });
          } else {
            this.setState({ saveState: saveStates.done });
          }
        }
      }
    });
  }
  makeButtons() {
    // if one of the games is cancelled, only cancel or modify should be available
    if (this.state.senderOwnedGame.isTradeAccepted || this.state.recipientOwnedGame.isTradeAccepted) {
      return <CancelButton key='cancel' onTouchTap={a => this.setTrade(a)} />;
    }

    // otherwise the buttons depend just on the status/whether this issue initiated
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
  render() {
    // handle different save cases
    switch (this.state.saveState) {
      case saveStates.none:
        break;
      case saveStates.modify:
        this.props.refreshTrades();
        return (
          <Redirect to={
            '/new/trade/modified/' + 
            encodeURIComponent(JSON.stringify(this.state.recipientOwnedGame))
            + '/' + 
            encodeURIComponent(JSON.stringify(this.state.senderOwnedGame))
          } /> 
        );
      case saveStates.done:
        this.props.refreshGames();
        this.props.refreshTrades();
        history.back();
      case saveStates.saving:   // eslint-disable-line
        return <Loading />;
      case saveStates.error:
        return <div className='error'>{JSON.stringify(this.state.error)}</div>
      default:
        return <div className='error'>Invalid save state</div>
    }

    // not in the middle of saving - just render the tradecard and buttons
    return (
      <div className='trade'>
        <TradeCard 
          currentUser={this.props.currentUser}
          trade={this.props.trade} 
          gameList={this.props.gameList} 
          key='card' 
          expanded={true}
        />
        {this.makeButtons()}
      </div>
    );
  }
}

OneTrade.propTypes = {
  refreshTrades: React.PropTypes.func.isRequired,
  refreshGames: React.PropTypes.func.isRequired,
  trade: React.PropTypes.object.isRequired,
  currentUser: React.PropTypes.string.isRequired,
  gameList: React.PropTypes.array.isRequired
}

export default OneTrade;