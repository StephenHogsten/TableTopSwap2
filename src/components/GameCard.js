import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import '../scss/GameCard.scss';

class GameCard extends Component {
  render() {
    let innards = (
      <p key='title' className='one-game-title'>{this.props.info.title}</p>
    )
    if (this.props.onClickFn) return (
      <div 
        className={this.props.selected? 'active-game': 'one-game'}
        onClick={ () => this.props.onClickFn() }
      >
        {innards}
      </div>
    );
    return (
      <Link 
        to={'/game/' + this.props.game_id}
        className={this.props.selected? 'active-game': 'one-game'}
      >
        {innards}
      </Link>
    );
    }
  }

GameCard.propTypes = {
  info: React.PropTypes.object.isRequired,
  game_id: React.PropTypes.number.isRequired,
  selected: React.PropTypes.bool,
  onClickFn: React.PropTypes.func
}

export default GameCard;