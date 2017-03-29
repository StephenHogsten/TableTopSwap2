import React, { Component } from 'react';

class OneGame extends Component {
  render() {
    console.log(this);
    return (
      <div className="game-list">
        Game Card
      </div>
    );
  }
}

OneGame.propTypes = {
  // 
  firstX: React.PropTypes.number,
  gameList: React.PropTypes.array.isRequired,
};

export default OneGame;