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
    let soughtGames = this.props.filterAllSought(this.props.gameList);
    let ownedGames = this.props.filterAllOwned(this.props.gameList);
    let mySoughtGames = this.props.filterMySought(this.props.gameList);
    let myOwnedGames = this.props.filterMyOwned(this.props.gameList);
    switch (this.props.displayOption) {
      case gameDisplayOptions.all:
        return (
          <div className='main-body'>
            <h2 className='section-header' key='section-header'>All Games</h2>
            <br key='br' />
            <h3 className='sub-section-header' key='my-sought-header'>My Games Sought</h3>
            <GameList firstX={4} gameList={mySoughtGames} key='my-sought-games'/>
            <h3 className='sub-section-header' key='my-owned-header'>My Games Offered</h3>
            <GameList firstX={4} gameList={myOwnedGames} key='my-owned-games'/>
            <h3 className='sub-section-header' key='sought-header'>Games Sought</h3>
            <GameList firstX={4} gameList={soughtGames} key='sought-games'/>
            <h3 className='sub-section-header' key='owned-header'>Games Offered</h3>
            <GameList firstX={4} gameList={ownedGames} key='owned-games'/>
          </div>
        );
      case gameDisplayOptions.all_users:
        return (
          <div className='main-body'>
            <h2 className='section-header' key='section-header'>Others' Games</h2>
            <br key='br' />
            <h3 className='sub-section-header' key='sought-header'>Games Sought</h3>
            <GameList firstX={4} gameList={soughtGames} key='sought-games'/>
            <h3 className='sub-section-header' key='owned-header'>Games Offered</h3>
            <GameList firstX={4} gameList={ownedGames} key='owned-games'/>
          </div>
        );
      case gameDisplayOptions.this_user: 
        return (
          <div className='main-body'>
            <h2 className='section-header' key='section-header'>My Games</h2>
            <br key='br' />
            <h3 className='sub-section-header' key='my-sought-header'>My Games Sought</h3>
            <GameList firstX={4} gameList={mySoughtGames} key='my-sought-games'/>
            <h3 className='sub-section-header' key='my-owned-header'>My Games Offered</h3>
            <GameList firstX={4} gameList={myOwnedGames} key='my-owned-games'/>
          </div>
        );
      case gameDisplayOptions.this_user_sought:
        return (
          <div className='main-body'>
            <h2 className='section-header' key='my-sought-header'>My Games Sought</h2>
            <GameList firstX={20} gameList={mySoughtGames} key='my-sought-games' />
          </div>
        );
      case gameDisplayOptions.this_user_offered:
        return (
          <div className='main-body'>
            <h2 className='section-header' key='my-owned-header'>My Games Offered</h2>
            <GameList firstX={20} gameList={myOwnedGames} key='my-owned-games' />
          </div>
        );
      case gameDisplayOptions.all_users_sought:
        return (
          <div className='main-body'>
            <h2 className='section-header' key='all-sought-header'>Games Sought</h2>
            <GameList firstX={20} gameList={soughtGames} key='sought-games' />
          </div>
        );
      case gameDisplayOptions.all_users_offered:
        return (
          <div className='main-body'>
            <h2 className='section-header' key='all-owned-header'>Games Offered</h2>
            <GameList firstX={20} gameList={ownedGames} key='owned-games' />
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