import React, { Component } from 'react';
import { Route, Link } from 'react-router-dom';
import {displayOptions, gameDisplayOptions, tradeDisplayOptions} from './enums.js';
import GameList from './GameList.js';

import '../scss/MainBody.scss';

class MainBody extends Component {
  render() {
    switch (this.props.display) {
      case displayOptions.games:
        return this.renderGamesSwitch();
      case displayOptions.trades:
        return this.renderTradesSwitch();
      default:
        console.log('error');
        return (
          <div className='error'>Invalid displayOption</div>
        );
    }
  }
  renderGamesSwitch() {
    switch (this.props.displayOption) {
      case gameDisplayOptions.all_users:
        let soughtGames = this.props.filterAllSought(this.props.gameList);
        let ownedGames = this.props.filterAllOwned(this.props.gameList);
        return (
          <div className='main-body'>
            <h2 className='section-header' id='section-header'>All Users</h2>
            <br key='br' />
            <h3 className='sub-section-header' id='sought-header'>Games Sought</h3>
            <GameList firstX={4} gameList={soughtGames} key='sought-games'/>
            <h3 className='sub-section-header' id='owned-header'>Games Offered</h3>
            <GameList firstX={4} gameList={ownedGames} key='owned-games'/>
          </div>
        );
      default:
        return (
          <div className='error'>Invalid gameDisplayOption</div>
        );
    }
  }
  renderTradesSwitch() {

  }
}

export default MainBody;

{/*<div className='app-body'>>
          <h3>All Games</h3>
          <h3>Trade For</h3>
          <h3>Trade With</h3>
          <h3>Links</h3>
          <Link to='/about'>Take me to About</Link><br />
          <Link to='/'>Take me to Home</Link>
          <Route path='/about' render={() => (
            <About text='mememe' />
          )} />
        </div>*/}