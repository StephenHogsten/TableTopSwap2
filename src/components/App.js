import React, { Component } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import '../scss/App.scss';
import injectTapEventPlugin from 'react-tap-event-plugin';  


// components
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import Menu from 'material-ui/svg-icons/navigation/menu';
import IconButton from 'material-ui/IconButton';
//  mine
import AppBody from './AppBody.js';

class App extends Component {
  constructor() {
    super();
    this.state = {
      gameList: [],
      currentUser: null
    };
    injectTapEventPlugin(); 
    this.getAllGames();
  }
  getAllGames() {
    // get the full list of games from the DB (trade for and trade away)
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

            <AppBody />
          </div>
        </MuiThemeProvider>
      </Router>
    );
  }
}

export default App;
