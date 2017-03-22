import React, { Component } from 'react';
import '../scss/Game.scss';

class Game extends Component {
  constructor(props) {
    super();
    this.lookupFromDb();
  }
  lookupFromDb() {
    // query the board game geek API
    // store directly to this properties
  }
  lookupFromBgg() {
    // query the board game geek API for the title?
    // may not actually need this
  }
  render() {
    return (
      <div className="one-game">
        <img className="one-game-image" alt="will get src later"/>
        <p classname="one-game-title">"title placeholder"</p>
      </div>
    );
  }
}

Game.propTypes = {

}

export default Game;