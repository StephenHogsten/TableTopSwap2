import React, { Component } from 'react';
import GridList from 'material-ui/GridList';
import Subheader from 'material-ui/Subheader';
import GameCard from './GameCard.js';
import '../scss/GameList.scss';

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
          onClickFn={ this.props.onClickFn?
            () => this.props.onClickFn(thisGame):
            null
          }
          selected={this.props.activeId == thisGame._id}
        />
      );
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
  onClickFn: React.PropTypes.func,
  activeId: React.PropTypes.string
};

export default GameList;