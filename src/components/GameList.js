import React, { Component } from 'react';
import '../scss/AllGames';

class GameList extends Component {
  render() {
    let gameList = [];
    for(let i=0; i<this.props.games; )
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