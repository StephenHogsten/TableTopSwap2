import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom';
import logo from '../logo.svg';
import '../scss/App.scss';
import AppBody from './AppBody.js';

class App extends Component {
  constructor() {
    super();
    this.state = {
      gameList: [],
      currentUser: null
    };
    this.getAllGames();
  }
  getAllGames() {
    // get the full list of games from the DB (trade for and trade away)
  }
  render() {
    return (
      <Router> 
        <div>
          <div className="app-header">
            <img src={logo} className="App-logo" alt="logo" />
            <h2>Welcome to React</h2>
          </div>

          <div className="app-sidebar">
          </div>

          <AppBody />
        </div>
      </Router>
    );
  }
}

export default App;
