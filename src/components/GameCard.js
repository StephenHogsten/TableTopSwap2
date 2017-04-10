import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {Card, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import dice from '../../public/dice.png';
import '../scss/GameCard.scss';

class GameCard extends Component {
  render() {
    let innards = (
      <Card className='game-card' style={{whiteSpace:'nowrap', textOverflow:'ellipsis'}} >
        <div className={this.props.selected? 'active-game': 'inactive-game'} />
        <div 
          style={{backgroundImage: 'url(' + (this.props.info.full_image_url || dice) + ')'}}
          className='game-image'
        >
        </div>
        <CardTitle 
          title={this.props.info.title} 
          subtitle={'rating: ' + (parseFloat(this.props.info.rating).toFixed(2) || 'none') } 
          titleStyle={{overflow:'hidden', textOverflow: 'ellipsis', maxHeight:'33px'}}
        />
      </Card>
    )
    if (this.props.onClickFn) return (
      <div 
        onClick={ () => this.props.onClickFn() }
      >
        {innards}
      </div>
    );
    return (
      <Link 
        to={'/game/' + this.props.game_id}
      >
        {innards}
      </Link>
    );
    }
  }

GameCard.propTypes = {
  info: React.PropTypes.object.isRequired,
  game_id: React.PropTypes.string.isRequired,
  selected: React.PropTypes.bool,
  onClickFn: React.PropTypes.func,
  expanded: React.PropTypes.bool
}

export default GameCard;