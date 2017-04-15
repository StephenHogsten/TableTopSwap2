import React, { Component } from 'react';

import { json as d3Json } from 'd3-request';

import Loading from './Loading.js';

import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Divider from 'material-ui/Divider';

import '../scss/Profile.scss';

const items = [];
for (let state of 'AL|AK|AS|AZ|AR|CA|CO|CT|DE|DC|FM|FL|GA|GU|HI|ID|IL|IN|IA|KS|KY|LA|ME|MH|MD|MA|MI|MN|MS|MO|MT|NE|NV|NH|NJ|NM|NY|NC|ND|MP|OH|OK|OR|PW|PA|PR|RI|SC|SD|TN|TX|UT|VT|VI|VA|WA|WV|WI|WY'.split('|')) {
  items.push(
    <MenuItem value={state} key={state} primaryText={state} />
  );
}

class Profile extends Component {
  constructor() {
    super();
    this.state = {
      changesEnabled: false,
      userInfo: null
    }
  }
  setUserState(key, val) {
    let newUserInfo = {};
    Object.assign(newUserInfo, this.state.userInfo);
    newUserInfo[key] = val;
    this.setState({
      changesEnabled: true,
      userInfo: newUserInfo
    });
  }
  updateUserRecord() {
    this.setState({
      changesEnabled: false,
      savingChanges: true
    });
    let apiString = '/api/update_user/' + this.props.currentUser
      + '?city=' + this.state.userInfo.city
      + '&state=' + this.state.userInfo.state;
    console.log('apistring', apiString);
    d3Json(apiString, (err, res) => {
      if (err) return console.log(err);
      this.setState({
        savingChanges: false
      });
    });
  }
  componentDidMount() {
    d3Json('/api/user/' + this.props.currentUser, (err, json) => {
      if (err) throw err;
      let id = this.props.currentUser;
      this.setState({
        userInfo: {
          email: json.email,
          picture: json.picture,
          join_date: json.join_date,
          username: json.username,
          city: json.city || '',
          state: json.state || ''
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
          <Divider />
          <div id='city-selection'>
            <p className='profile-info-label' key='label'>City: </p>
            <TextField 
              key='value'
              id='city-field' 
              onChange={(event, val) => {console.log('event,idx,val', event, val); this.setUserState('city', val);}}
              defaultValue={this.state.userInfo.city}
            />
          </div>
          <div id='state-selection'>
            <p className='profile-info-label' key='label'>State: </p>
            <SelectField 
              key='value' 
              onChange={ (event, idx, val) => this.setUserState('state', val) }
              value={this.state.userInfo.state}
            >
              {items}
            </SelectField>
          </div>
          <RaisedButton 
            primary={true}
            label='Save Changes'
            onTouchTap={() => this.updateUserRecord()}
          />
          { this.state.savingChanges? <Loading />: null }
        </div>
      );
    } else {
      return (
        <Loading />
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