import React, { Component } from 'react';
import GameCard from './GameCard.js';
// import '../scss/AllGames';

class GameList extends Component {
  render() {
    let count = this.props.firstX
    count = count? this.props.firstX: 40;
    count = Math.min(count, this.props.gameList.length);
    let games = [];
    for(let i=0; i<count; i++) {
      let thisGame = this.props.gameList[i];
      games.push(
        <GameCard 
          key={thisGame._id || thisGame.BGG_id}
          game_id={thisGame._id}
          info={thisGame.BGG_info}
        />
      )
    }
    if (games.length === 0) games.push(
      <p className='no-games' key='no-games'>None</p>
    );
    return (
      <div className="game-list">
        {games}
      </div>
    );
  }
}

GameList.propTypes = {
  // 
  firstX: React.PropTypes.number,
  gameList: React.PropTypes.array.isRequired,
};

export default GameList;