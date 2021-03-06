import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {Card, CardHeader, CardTitle, CardText} from 'material-ui/Card';
import AccessTimeIcon from 'material-ui/svg-icons/device/access-time';
import PersonOutlineIcon from 'material-ui/svg-icons/social/person-outline';
import SchoolIcon from 'material-ui/svg-icons/social/school';
import dice from '../../public/dice.png';
import '../scss/GameCard.scss';

class GameCard extends Component {
  info2Num(property, digits) {
    let num = Number(this.props.game.BGG_info[property]);
    return digits? parseFloat(num).toFixed(digits) || 'n/a': num || 'n/a';
  }
  lowHigh(property) {
    let low = this.info2Num(property + '_low');
    let high = this.info2Num(property + '_high');
    if (high > low) return low + '-' + high;
    return low + '+';
  }
  makeHeader() {
    if (this.props.game.isTradeAccepted) { 
      return 'Trade Completed';
    }
    let user = this.props.game.user;
    if (user.city) {
      if (user.state) {
        return user.city + ', ' + user.state;
      } else {
        return user.city;
      }
    } else if (user.state) {
      return user.state;
    } else {
      return 'location unknown';
    }
  }
  makeImageStyle() {
    let style = {
      backgroundImage: 'url(' + (this.props.game.BGG_info.full_image_url || dice) + ')'
    };
    if (this.props.game.isTradeAccepted) {
      style.filter = 'grayscale(1)';
    }
    return style;
  }
  render() {
    let innards = (
      <Card 
        className={this.props.isExpanded? 'game-card-expanded': 'game-card'}
        style={{whiteSpace:'nowrap', textOverflow:'ellipsis'}} 
      >
        <div className={
          this.props.game.isTradeAccepted? 'traded-game':
          (this.props.selected? 'active-game': 'inactive-game')
        } />
        <CardHeader 
          title={(this.props.game.sought_or_owned === 'sought'? 'Seeker: ': 'Owner: ') + this.props.game.user.username} 
          subtitle={this.makeHeader()}
        />
        <div 
          style={this.makeImageStyle()}
          className={this.props.isExpanded? 'game-image-expanded': 'game-image'}
        >
        </div>
        <CardTitle 
          title={this.props.game.BGG_info.title} 
          subtitle={'Rating: ' + this.info2Num('rating', 2) } 
          titleStyle={{overflow:'hidden', textOverflow: 'ellipsis', maxHeight:'33px'}}
        />
        {this.props.isExpanded? (
          <CardText style={{padding:'5px'}} color='rgba(0, 0, 0, 0.541176)'>
            <span className='game-text-row'><AccessTimeIcon className='game-text-icon'/><span>{
                this.lowHigh('minutes')
              }</span></span>
            <span className='game-text-row'><PersonOutlineIcon className='game-text-icon'/><span>{
                this.lowHigh('players')
              }</span></span>
            <span className='game-text-row'><SchoolIcon className='game-text-icon'/><span>{
                this.info2Num('difficulty', 2)
              }</span></span>
          </CardText>
        ): null}
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
        to={'/game/' + this.props.game._id}
      >
        {innards}
      </Link>
    );
    }
  }

GameCard.propTypes = {
  game: React.PropTypes.object.isRequired,
  selected: React.PropTypes.bool,
  onClickFn: React.PropTypes.func,
  isExpanded: React.PropTypes.bool
}

export default GameCard;

export const NoneCard = (props) => (
  <Link to={'/' + props.linkTo}>
    <Card className='none-card'>
      <CardTitle title={props.title || 'None'} titleColor='#666' />
    </Card>
  </Link>
);

export const MoreCard = (props) => (
  <Link to={props.linkTo}>
    <Card className='more-card' style={{backgroundColor:'rgba(220,120,120,0.5)'}}>
      <CardTitle title='See More' titleColor='white' />
    </Card>
  </Link>
)