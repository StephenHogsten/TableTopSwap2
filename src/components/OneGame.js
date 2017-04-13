import React, { Component } from 'react';

import AddButton from './AddButton.js';
import GameCard from './GameCard.js';
import '../scss/OneGame.scss';

class OneGame extends Component {
  render() {
    console.log(this);
    let addButton=null;
    if (this.props.user && this.props.game.sought_or_owned === 'owned') {
      let mode = this.props.user === this.props.game.user? 'trade_sender': 'trade_receiver';
      addButton=<AddButton user={this.props.user} mode={mode} game={this.props.game} />
    }
    return (
      <div className='one-game'>
        <GameCard 
          game={this.props.game}
          expanded={true}
          onClickFn={ () => window.open('https://boardgamegeek.com/boardgame/' + this.props.game.BGG_id)}
        />
        {addButton}
      </div>
    );
  }
}

OneGame.propTypes = {
  game: React.PropTypes.object.isRequired,
  user: React.PropTypes.string,
};

export default OneGame;