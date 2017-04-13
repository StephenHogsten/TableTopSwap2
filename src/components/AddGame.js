import React, { Component } from 'react';
import { json as d3Json } from 'd3-request';

import TextField from 'material-ui/TextField';
import SearchIcon from 'material-ui/svg-icons/action/search';

import Loading from './Loading.js';

import '../scss/AddGame.scss';

const saveStates = {
  'none': 'none',
  'saving': 'saving',
  'done': 'done',
  'error': 'error'
};

class AddGame extends Component {
  constructor() {
    super();
    this.state = {
      gameResults: [],
      isWaiting: false,
      waitingId: null,
      saveState: saveStates.none,
      error: null
    };
  }
  searchForGameDelay(event, delay=600) {
    // clear any pending searches
    clearTimeout( this.searchTimeout );
    let gameTitle = encodeURIComponent(event.target.value);
    if (!gameTitle) return;
    this.searchTimeout = setTimeout( () => this.searchForGame(gameTitle), delay);
  }
  searchForGame(gameTitle, manual) {
    clearTimeout( this.searchTimeout );
    let waitingId = Math.round(100000 * Math.random());   //generate a random number
    this.setState({ 
      isWaiting: true,
      waitingId: waitingId
    });
    d3Json('/api/bggSearch/' + gameTitle, (err, data) => {
      // use closures to the ignore the wrong results
      if (waitingId !== this.state.waitingId) { 
        return;
      }
      if (err) throw err;
      let games = data.map( (oneGame) => (
        <p 
          key={oneGame.id} 
          className='game-search-result'
          onClick={ () => this.saveGame(oneGame.id) }
        >
          {oneGame.title + ' (' + oneGame.year + ')'}
        </p>
      ));
      this.setState({
        isWaiting: false,
        gameResults: games
      });
    });
  }
  saveGame(gameId) {
    this.setState({ saveState: saveStates.saving });
    let searchFor = '/api/add_game?id=' + gameId + '&issought=' + !this.props.isGameOwned;
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
      this.props.refreshGames();
      history.back();
    }
  }
  render() {
    switch (this.state.saveState) {
      case saveStates.done:
        console.log('state: done');
      case saveStates.none:   // eslint-disable-line
        break;
      case saveStates.saving:
        return <Loading />;
      case saveStates.error:
        return <div className='error'>{JSON.stringify(this.state.error)}</div>;
      default:
        console.log('invalid state: ' + this.state.saveState);
        return <div className='error'>Error: invalid save state</div>;
    }
    return (
      <div className='new-game'>
        <h2>{
          this.props.isGameOwned? 
          "What game do you want to trade away?":
          "What game are you looking for?"
        }</h2>
        <div className='search-bar' onKeyDown={(event) => {
          if (event.key === 'Enter') { 
            let val = event.target.value;
            if (val) { this.searchForGame(val, 'enter'); }
          }
        }}>
          <TextField 
            type='text' 
            id='game-title' 
            hintText='game title'
            onChange={(event) => this.searchForGameDelay(event) }
          />
          <SearchIcon style={{color:"#666"}} onClick={ (event) => {
            this.searchForGame( document.getElementById('game-title').value, 'click' );
          }}/>
        </div>
        {this.state.isWaiting? (
          <Loading />
        ) : (
          <div className='game-search-list'>
            {this.state.gameResults}
          </div>
        )}
      </div>
    )
  }
}

AddGame.propTypes = {
  user: React.PropTypes.string.isRequired,
  myOwnedGames: React.PropTypes.array,
  mySoughtGames: React.PropTypes.array,
  isGameOwned: React.PropTypes.bool,
  refreshGames: React.PropTypes.func.isRequired
};

export default AddGame;