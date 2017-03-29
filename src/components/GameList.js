import React, { Component } from 'react';
import Game from './Game.js';
import '../scss/AllGames';

class GameList extends Component {
  render() {
    let count = this.props.firstX
    count = count? this.props.firstX: 40;
    count = Math.min(count, this.props.gameList.length);
    let games = [];
    for(let i=0; i<count; i++) {
      
    }
    return (
      <div className="game-section">
        <h2 className="game-section-header">{this.props.sectionHeader}</h2>
        <div className="game-section-holder">
          {gameList}
        </div>
      </div>
    );
  }
}

GameList.propTypes = {
  // 
  games: React.PropTypes.object.isRequired,
  title: React.PropTypes.string.isRequired
};

export default GameList;