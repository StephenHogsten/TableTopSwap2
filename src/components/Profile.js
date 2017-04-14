import React, { Component } from 'react';

import { json as d3Json } from 'd3-request';

import AutoRenewIcon from 'material-ui/svg-icons/action/autorenew';

import '../scss/Profile.scss';

class Profile extends Component {
  constructor() {
    super();
    this.state = {
      userInfo: null
    }
  }
  componentDidMount() {
    d3Json('/api/checksession', (err, json) => {
      if (err) throw err;
      let id = this.props.currentUser;
      this.setState({
        userInfo: {
          email: json.email,
          picture: json.picture,
          join_date: json.join_date,
          username: json.username
        },
        trades: this.props.trades.filter( (trade) => (
          trade.sender.user._id === id || trade.recipient.user._id === id
        )).length,
        owned: this.props.games.filter( (game) => (
          game.user._id === id && game.sought_or_owned === 'owned'
        )).length,
        sought: this.props.games.filter( (game) => (
          game.user._id === id && game.sought_or_owned === 'sought'
        )).length
      });
    });
  }
  render() {
    if (this.props.currentUser && this.state.userInfo) {
      return (
        <div className='profile-body'>
          <h2>{'Hello, ' + this.state.userInfo.username + '!'}</h2>
          <p className='profile-info-label'>Trades Completed: 
            <span className='profile-info'>
              {this.state.trades}
            </span>
          </p>
          <p className='profile-info-label'>Games Owned: 
            <span className='profile-info'>
              {this.state.owned}
            </span>
          </p>
          <p className='profile-info-label'>Games Sought: 
            <span className='profile-info'>
              {this.state.sought}
            </span>
          </p>
        </div>
      )
    } else {
      return (
        <AutoRenewIcon className='loading' />
      );
    }
  }
}

Profile.propTypes = {
  currentUser: React.PropTypes.string.isRequired,
  trades: React.PropTypes.array.isRequired,
  games: React.PropTypes.array.isRequired
};

export default Profile;