import React, { Component } from 'react';
import { json as d3Json} from 'd3-request';

import GameList from './GameList.js';

import {Step, Stepper, StepLabel} from 'material-ui/Stepper';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import AutoRenewIcon from 'material-ui/svg-icons/action/autorenew';

const laststep = 2;
const saveStates = {
  'none': 'none',
  'saving': 'saving',
  'done': 'done',
  'error': 'error'
}

class TradeSteps extends Component {
  constructor(props) {
    super();
    this.state = {
      step: 0,
      recipient: null,
      recipientOwned: props.ownedGame || -1,
      senderOwned: props.myOwnedGame || -1,
      notes: "",
      saveState: saveStates.none,
      error: null
    };
  }
  stepDetails() {
    switch (this.state.step) {
      case 0:
        return (
          <div className='trade-details-body'>
            <h5>Choose a game from our community that you would like to trade for</h5>
            <GameList 
              gameList={this.props.ownedGames} 
              activeId={String(this.state.recipientOwned._id)} 
              onClickFn={ (game) => { this.setState({ recipientOwned: game, recipient: game.user }); } } 
            />
          </div>
        );
      case 1:
        return (
          <div className='trade-details-body'>
            <h5>Choose a game from your collection that you would like to offer</h5>
            <GameList 
              gameList={this.props.myOwnedGames} 
              activeId={String(this.state.senderOwned._id)} 
              onClickFn={ (game) => { this.setState({ senderOwned: game }); } } 
            />
          </div>
        );
      case 2:
        return (
          <div className='trade-details-body'>
            <h5>(optional) Add a message to your request</h5>
            <TextField 
              multiLine={true} 
              id='trade-notes' 
              value={this.state.notes}
              onChange={ (event) => this.setState({ notes: event.target.value }) }
            />
          </div>
        );
      default:
        return (
          <p className='error'>I don't know what's happening</p>
        );
    }
  }
  isNextDisabled(step) {
    switch (step) {
      case 0:
        if (this.state.recipientOwned === -1) return true;
        else return false;
      case 1:
        if (this.state.senderOwned === -1) return true;
        else return false;
      default:
        return true;
    }
  }
  moveStep(increment) {
    let {step} = this.state;
    step += increment;
    this.setState({ step: step });
  }
  handleSubmit() {
    this.setState({ saveState: saveStates.saving });
    // see if there's already corresponding sought games
    let senderOwned = this.state.senderOwned;
    let recipientOwned = this.state.recipientOwned;
    let mySought = this.props.mySoughtGames.find( (game) => game.BGG_id === recipientOwned.BGG_id );
    let sought = this.props.soughtGames.find( (game) => game.BGG_id === senderOwned.BGG_id)
    let searchFor = '/api/add_trade?sender_owned_game=' + senderOwned._id 
      + '&receiver_owned_game=' + recipientOwned._id
      + '&receiver=' + this.state.recipient
      + '&notes=' + this.state.notes
      + '&status=' + 'sent';    // eslint-disable-line
    if (mySought) searchFor += '&sender_sought_game=' + mySought._id;
    if (sought) searchFor += '&recever_sought_game=' + sought._id;
    d3Json(searchFor, (err, data) => {
      if (err) {
        this.setState({ saveState: saveStates.error, error: err });
      } else {
        if (data.hasOwnProperty('error')) {
          this.setState({ saveState: saveStates.error, error: data.error });
        } else {
          this.setState({ saveState: saveStates.done });
        }
      }
    });
  }
  componentWillUpdate(nextProps, nextState) {
      if (nextState.saveState === saveStates.done) {
        history.back();
      }
  }
  render() {
    switch (this.state.saveState) {
      case saveStates.none:
        break;
      case saveStates.done:
      case saveStates.saving:
        return <AutoRenewIcon className='loading' />;
      case saveStates.error:
        return <div className='error'>{JSON.stringify(this.state.error)}</div>
      default: 
        return <div className='error'>Invalid save state</div>
    }
    const step = this.state.step;
    return (
      <div className='trade-steps'>
        <Stepper activeStep={step}>
          <Step>
            <StepLabel>Select a game</StepLabel>
          </Step>
          <Step>
            <StepLabel>Offer a game</StepLabel>
          </Step>
          <Step>
            <StepLabel>Send your request</StepLabel>
          </Step>
        </Stepper>
        <div className='step-details'>{this.stepDetails()}</div>
        {step > 0? (
          <FlatButton 
            label='back'   
            onTouchTap={ () => this.moveStep(-1) }
          />
          ): (
          <FlatButton
            label='cancel'
            onTouchTap={ () => history.back() }
          /> )}
        {step < laststep? (
          <RaisedButton
            label='next'
            primary={true}
            disabled={this.isNextDisabled(step)}
            onTouchTap={ () => this.moveStep(1) }
          />
        ): (
          <RaisedButton
            label='submit'
            primary={true}
            onTouchTap={ () => this.handleSubmit() }
          />
        )}  
      </div>
    );
  }
}

TradeSteps.propTypes = {
  soughtGames: React.PropTypes.array.isRequired,
  ownedGames: React.PropTypes.array.isRequired,
  mySoughtGames: React.PropTypes.array.isRequired,
  myOwnedGames: React.PropTypes.array.isRequired,
  ownedGame: React.PropTypes.object,
  myOwnedGame: React.PropTypes.object
};

export default TradeSteps;