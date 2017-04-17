import React, { Component } from 'react';
import { json as d3Json} from 'd3-request';

import GameList from './GameList.js';
import Loading from './Loading.js';

import {Step, Stepper, StepLabel} from 'material-ui/Stepper';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';

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
    // create the body for each step
    switch (this.state.step) {
      case 0:
        return (
          <div className='trade-details-body'>
            <h5>Choose a game from our community that you would like to trade for</h5>
            <GameList 
              gameList={this.props.ownedGames} 
              activeId={String(this.state.recipientOwned._id)} 
              onClickFn={ (game) => { this.setState({ recipientOwned: game, recipient: game.user._id }); } } 
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
            <h5 style={{marginBottom:'5px'}}>(optional) Add a message to your request</h5>
            <TextField 
              multiLine={true} 
              id='trade-notes' 
              value={this.state.notes}
              onChange={ (event) => this.setState({ notes: event.target.value }) }
              autoFocus
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
    // check whether we're able to move on to the next step
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

    // build api string
    let searchFor = '/api/add_trade?sender_owned_game=' + senderOwned._id 
      + '&receiver_owned_game=' + recipientOwned._id
      + '&receiver_owned_BGG_id=' + recipientOwned.BGG_id
      + '&receiver=' + this.state.recipient
      + '&notes=' + this.state.notes
      + '&status=' + 'sent';    // eslint-disable-line
    if (mySought) searchFor += '&sender_sought_game=' + mySought._id;
    if (sought) searchFor += '&receiver_sought_game=' + sought._id;

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
  moveBackButton(step) {
    if (step > 0) {
      return (
        <FlatButton 
          style={{margin:'4px'}}
          label='back'   
          onTouchTap={ () => this.moveStep(-1) }
        />
      ); 
    } else {
      return (
        <FlatButton
          style={{margin:'4px'}}
          label='cancel'
          onTouchTap={ () => history.back() }
        /> 
      );
    }
  }
  moveForwardButton(step) {
    if (step < laststep) { 
      return (
        <RaisedButton
          label='next'
          primary={true}
          disabled={this.isNextDisabled(step)}
          onTouchTap={ () => this.moveStep(1) }
        />
      );
    } else {
      return (
        <RaisedButton
          label='submit'
          primary={true}
          onTouchTap={ () => this.handleSubmit() }
        />
      );
    }  
  }

  render() {
    switch (this.state.saveState) {
      case saveStates.none:
        break;
      case saveStates.done:
        this.props.refreshTrades();
        this.props.refreshGames();
        history.back();
      case saveStates.saving:   // eslint-disable-line
        return <Loading />;
      case saveStates.error:
        return <div className='error'>{JSON.stringify(this.state.error)}</div>
      default: 
        return <div className='error'>Invalid save state</div>
    }
    const step = this.state.step;
    return (
      <div className='trade-steps'>
        <h5 className='section-header'>Propose New Trade</h5>
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
        {this.moveBackButton(step)}
        {this.moveForwardButton(step)}
        <div className='step-details'>{this.stepDetails()}</div>
      </div>
    );
  }
}

TradeSteps.propTypes = {
  refreshTrades: React.PropTypes.func.isRequired,
  refreshGames: React.PropTypes.func.isRequired,
  soughtGames: React.PropTypes.array.isRequired,
  ownedGames: React.PropTypes.array.isRequired,
  mySoughtGames: React.PropTypes.array.isRequired,
  myOwnedGames: React.PropTypes.array.isRequired,
  ownedGame: React.PropTypes.object,
  myOwnedGame: React.PropTypes.object
};

export default TradeSteps;