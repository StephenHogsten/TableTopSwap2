import React, { Component } from 'react';

class OneGame extends Component {
  render() {
    console.log(this);
    return (
      <h1>{this.props.game.BGG_info.title}</h1>
    );
  }
}

OneGame.propTypes = {
  game: React.PropTypes.object.isRequired
};

export default OneGame;