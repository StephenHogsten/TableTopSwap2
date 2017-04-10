import React, { Component } from 'react';

import AddButton from './AddButton.js';
import GameCard from './GameCard.js';
impor

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
          info={this.props.game.BGG_info} 
          game_id={this.props.game._id}
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