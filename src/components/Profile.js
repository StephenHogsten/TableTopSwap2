import React, { Component } from 'react';

import { json as d3Json } from 'd3-request';

import AutoRenewIcon from 'material-ui/svg-icons/action/autorenew';

class OneGame extends Component {
  constructor() {
    super();
    this.state = {
      userInfo: null
    }
  }
  componentDidMount() {
    d3Json('/api/checksession', (err, json) => {
      if (err) throw err;
      this.setState({
        email: json.email,
        picture: json.picture,
        join_date: json.join_date,
        nickname: json.username
      });
    });
  }
  render() {
    if (this.props.currentUser && this.state.userInfo) {
      return (
        <div className='profile-body'>
          <h2>{'Hello ' + this.state.userInfo.nickname}</h2>
          <img src={this.state.userInfo.picture} alt='user photo' />
        </div>
      )
    } else {
      return (
        <AutoRenewIcon className='loading' />
      );
    }
  }
}

OneGame.propTypes = {
  currentUser: React.PropTypes.string.isRequired
};

export default OneGame;