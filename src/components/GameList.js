import React, { Component } from 'react';
import GameCard, { NoneCard } from './GameCard.js';
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
          selected={this.props.activeId === thisGame._id}
        />
      );
    }
    if (games.length === 0) games.push(
      <NoneCard linkTo={
        this.props.hasOwnProperty('isOwned')?
        (this.props.isOwned? 'new/game/owned': 'new/game/sought'):
        ""
      } />
    );
    return (
      <div className="game-list">
        {games}
      </div>
    );
  }
}

GameList.propTypes = {
  isOwned: React.PropTypes.bool,
  firstX: React.PropTypes.number,
  gameList: React.PropTypes.array.isRequired,
  onClickFn: React.PropTypes.func,
  activeId: React.PropTypes.string
};

export default GameList;