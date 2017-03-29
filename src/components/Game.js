import React, { Component } from 'react';
// import '../scss/Game.scss';

class Game extends Component {
  render() {
    // this will mostly be a card (at least without hover) later
    return (
      <div className='one-game'>  
        <p key='title' classname='one-game-title'>{this.props.info.title}</p>
      </div>
    );
  }
}

Game.propTypes = {
  info: React.PropTypes.object.isRequired
}

export default Game;