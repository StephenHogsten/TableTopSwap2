import React, { Component } from 'react';

import AddButton from './AddButton.js';

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
        <h1>{this.props.game.BGG_info.title}</h1>
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