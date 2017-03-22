import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom';
import logo from '../logo.svg';
import '../scss/App.scss';
import About from './About.js';

class App extends Component {
  render() {
    return (
      <Router> 
        <div className="App">
          <div className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <h2>Welcome to React</h2>
          </div>
          <p className="App-intro">
            To get started, edit <code>src/App.js</code> and save to reload.
          </p>
          <div>
            <Link to='/about'>Take me to About</Link><br />
            <Link to='/'>Take me to Home</Link>
            <Route path="/about" render={() => (
              <About text='mememe' />
            )} />
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
