import React, { Component } from 'react';
import GameCard, { NoneCard, MoreCard } from './GameCard.js';
import '../scss/GameList.scss';

class GameList extends Component {
  render() {
    // set-up display counts
    let count = this.props.firstX || 100; // cap at 100 until we page
    let shouldAddMore;
    if (count < this.props.gameList.length) { shouldAddMore = true; }
    else { count = this.props.gameList.length; }
    count = Math.min(count, this.props.gameList.length);

    // add GameCard s to list
    let games = [];
    for(let i=0; i<count; i++) {
      let thisGame = this.props.gameList[i];
      games.push(
        <GameCard 
          key={thisGame._id || thisGame.BGG_id}
          game={thisGame}
          onClickFn={ this.props.onClickFn?
            () => this.props.onClickFn(thisGame):
            null
          }
          selected={this.props.activeId === thisGame._id}
        />
      );
    }

    // handle none case & see more case
    if (games.length === 0) { games.push(
      <NoneCard key='none' linkTo={
        this.props.hasOwnProperty('isOwned')?
        (this.props.isOwned? 'new/game/owned': 'new/game/sought'):
        ""
      } />
    )} else if (shouldAddMore && this.props.seeMoreLink) { 
      games.push(
        <MoreCard key='more' linkTo={this.props.seeMoreLink} />
      );
    }
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
  activeId: React.PropTypes.string,
  seeMoreLink: React.PropTypes.string
};

export default GameList;