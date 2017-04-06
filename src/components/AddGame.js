import React, { Component } from 'react';
import { json as d3Json } from 'd3-request';

import SearchIcon from 'material-ui/svg-icons/action/search';
import AutoRenewIcon from 'material-ui/svg-icons/action/autorenew';

const saveStates = {
  'none': 'none',
  'in_process': 'in_process',
  'done': 'done',
  'error': 'error'
};

class AddGame extends Component {
  constructor() {
    super();
    this.state = {
      isGameOwned: false,
      gameResults: [],
      saveState: saveStates.none,
      error: null
    };
  }
  searchForGameDelay(event, delay=600) {
    clearTimeout( this.searchTimeout );
    let gameTitle = encodeURIComponent(event.target.value);
    if (!gameTitle) return;
    this.searchTimeout = setTimeout( () => this.searchForGame(gameTitle), delay);
  }
  saveGame(gameId) {
    console.log('we\'re supposed to save the game to db');
    let searchFor = '/api/add-game?id=' + gameId + '&sought=' + !this.state.isGameOwned;
    d3Json(searchFor, (err, data) => {
      if (err) {
        this.setState({ saveState: this.saveStates.error, error: err });
      } else {
        this.setState({ saveState: this.saveStates.done });
      }
    });
  }
  searchForGame(gameTitle) {
    console.log('searching...');
    d3Json('/api/bggSearch/' + gameTitle, (err, data) => {
      console.log('error');
      console.log(err);
      console.log('data');
      console.log(data);
      if (err) throw err;
      let games = data.map( (oneGame) => (
        <p 
          key={oneGame.title} 
          className='game-search-result'
          onClick={ () => this.saveGame(oneGame.id) }
        >
          {oneGame.title + ' (' + oneGame.year + ')'}
        </p>
      ));
      this.setState({
        gameResults: games
      });
    });
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
      case saveStates.in_process:
        return <AutoRenewIcon className='loading' />;
      case saveStates.error:
        return <div className='error'>{JSON.stringify(this.state.error)}</div>;
      default:
        // done should've been handled in componentWillMount
        return <div className='error'>Error: invalid save state</div>;
    }
    return (
      <div className='new-game'>
        <h2>{
          this.props.isGameOwned? 
          "What game do you want to trade away?":
          "What game are you looking for?"
        }</h2>
        <input 
          type='text' 
          id='game-title' 
          placeholder='title' 
          onFocus={(event) => event.target.select()}
          onChange={(event) => this.searchForGameDelay(event) }
        />
        <SearchIcon />
        <div className='game-list'>
          {this.state.gameResults}
        </div>
      </div>
    )
  }
}

AddGame.propTypes = {
  user: React.PropTypes.string.isRequired,
  myOwnedGames: React.PropTypes.array,
  mySoughtGames: React.PropTypes.array,
  isGameOwned: React.PropTypes.bool
};

export default AddGame;