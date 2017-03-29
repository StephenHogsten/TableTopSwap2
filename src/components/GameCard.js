import React, { Component } from 'react';
// import '../scss/Game.scss';

class GameCard extends Component {
  render() {
    // this will mostly be a card (at least without hover) later
    return (
      <div className='one-game'>  
        <p key='title' className='one-game-title'>{this.props.info.title}</p>
      </div>
    );
  }
}

GameCard.propTypes = {
  info: React.PropTypes.object.isRequired
}

export default GameCard;