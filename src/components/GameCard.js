import React, { Component } from 'react';
import { Link } from 'react-router-dom';
// import '../scss/Game.scss';

class GameCard extends Component {
  render() {
    // this will mostly be a card (at least without hover) later
    return (
      <Link 
        to={'/game/' + this.props.game_id}
        className='one-game'
      >  
        <p key='title' className='one-game-title'>{this.props.info.title}</p>
      </Link>
    );
  }
}

GameCard.propTypes = {
  info: React.PropTypes.object.isRequired,
  game_id: React.PropTypes.number.isRequired
}

export default GameCard;