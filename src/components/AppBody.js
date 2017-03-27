import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom';
// import d3 from 'd3-request';
import {json as d3} from 'd3-request';

class AppBody extends Component {
  constructor() {
    super();
    this.games = 'start';
    this.getGames();
  }
  getGames() {
    console.log(d3);
    d3('/api/test', (err, data) => {
      console.log(data);
      console.log(err);
      this.games = data.data;
      this.forceUpdate();
    });
  }
  render() {
    return (
      <div>
        {this.games}
      </div>
    );
  }
}

export default AppBody;

{/*<div className="app-body">>
          <h3>All Games</h3>
          <h3>Trade For</h3>
          <h3>Trade With</h3>
          <h3>Links</h3>
          <Link to='/about'>Take me to About</Link><br />
          <Link to='/'>Take me to Home</Link>
          <Route path="/about" render={() => (
            <About text='mememe' />
          )} />
        </div>*/}