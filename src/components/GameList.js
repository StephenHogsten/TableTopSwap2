import React, { Component } from 'react';
import Game from './Game.js';
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
        <Game 
          key={thisGame._id || thisGame.BGG_id}
          info={thisGame.BGG_info}
        />
      )
    }
    if (games.length === 0) games.push(
      <p className='no-games'>None</p>
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