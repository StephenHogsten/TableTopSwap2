import React, { Component } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import '../scss/App.scss';
import injectTapEventPlugin from 'react-tap-event-plugin';  
import * as d3 from 'd3-request';


// components
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import Menu from 'material-ui/svg-icons/navigation/menu';
import IconButton from 'material-ui/IconButton';
//  mine
import MainBody from './MainBody.js';
import {displayOptions, gameDisplayOptions, tradeDisplayOptions} from './enums.js';

class App extends Component {
  constructor() {
    super();
    injectTapEventPlugin(); 
    this.state = {
      gameList: [],
      currentUser: null,
      display: displayOptions.games,
      displayOption: gameDisplayOptions.all
    };
    this.getAllGames();
  }
  getAllGames() {
    d3.json('/api/test', (err, data) => {
      if (err) throw err;
      this.setState({
        gameList: data
      });
    });
  }
  // probably need to add something that checks whether user is logged in, and if so 
  filterAllSought(gameList) {
    return gameList.filter( (game) => game.sought_or_owned === 'sought' );
  }
  filterAllOwned(gameList) {
    return gameList.filter( (game) => game.sought_or_owned === 'owned' );
  }
  render() {
    return (
      <Router> 
        <MuiThemeProvider>
          <div>
            <AppBar 
              iconElementLeft={<IconButton><Menu /></IconButton>}
              title="Tabletop Swap"
              iconClassNameRight="App-logo"
            />

            <div className="app-sidebar">
            </div>

            <MainBody 
              gameList={this.state.gameList}
              display={this.state.display}
              displayOption={this.state.displayOption}
              filterAllSought={(gameList) => this.filterAllSought(gameList)}
              filterAllOwned={(gameList) => this.filterAllOwned(gameList)}
            />
          </div>
        </MuiThemeProvider>
      </Router>
    );
  }
}

export default App;
