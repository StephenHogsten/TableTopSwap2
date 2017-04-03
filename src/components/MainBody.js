import React, { Component } from 'react';
import { Switch, Route, Link, Redirect } from 'react-router-dom';

import GameList from './GameList.js';
import TradeList from './TradeList.js';
import OneGame from './OneGame.js';
import OneTrade from './OneTrade.js';
import TradeSteps from './TradeSteps.js';
import AddGame from './AddGame.js';
import Profile from './Profile.js';
import LoginForm from './LoginForm.js';
import ProxyText from './ProxyTest.js';

import '../scss/MainBody.scss';

class SaveUserAndRedirect extends Component {
  componentWillMount() {
    this.props.saveUser( this.props.match.params.username );
  }
  render() {
    return (
      <Redirect to='/' /> 
    );
  }
}

class MainBody extends Component {
  // add the add button
  render() {
    let soughtGames = this.props.filterAllSought(this.props.gameList);
    let ownedGames = this.props.filterAllOwned(this.props.gameList);
    let mySoughtGames = this.props.filterMySought(this.props.gameList);
    let myOwnedGames = this.props.filterMyOwned(this.props.gameList);

    return (
      <Switch className='main-body-routes'>
        <Route path='/proxyme/:toproxy' component={ProxyText} />
        <Route exact path='/' render={() => (
          <div className='main-body'>
            <h2 className='section-header' key='section-header'>All Games</h2>
            <br key='br' />
            <Link to='/my_games/sought' className='sub-section-header' key='my-sought-header'>My Games Sought</Link>
            <GameList firstX={4} gameList={mySoughtGames} key='my-sought-games'/>
            <Link to='/my_games/owned' className='sub-section-header' key='my-owned-header'>My Games Offered</Link>
            <GameList firstX={4} gameList={myOwnedGames} key='my-owned-games'/>
            <Link to='/all_games/sought' className='sub-section-header' key='sought-header'>Games Sought</Link>
            <GameList firstX={4} gameList={soughtGames} key='sought-games'/>
            <Link to='/all_games/owned' className='sub-section-header' key='owned-header'>Games Offered</Link>
            <GameList firstX={4} gameList={ownedGames} key='owned-games'/>
          </div>
        )} />
        <Route exact path='/login' component={LoginForm} />
        <Route exact path='/login_failed/' render={({match}) => (
          <LoginForm loginFailed='true' />
        )}/>
        <Route path='/store_user/:username' render={({match}) => (
          <SaveUserAndRedirect match={match} saveUser={(user) => this.props.saveUser(user)} />
        )} />
        <Route exact path='/profile' render={() => (
          <Profile user={this.props.currentUser} />
        )} />
        <Route exact path='/all_games' render={() => (
          <div className='main-body'>
            <h2 className='section-header' key='section-header'>Others' Games</h2>
            <br key='br' />
            <Link to='/all_games/sought' className='sub-section-header' key='sought-header'>Games Sought</Link>
            <GameList firstX={4} gameList={soughtGames} key='sought-games'/>
            <Link to='/all_games/owned' className='sub-section-header' key='owned-header'>Games Offered</Link>
            <GameList firstX={4} gameList={ownedGames} key='owned-games'/>
          </div>
        )} />
        <Route exact path='/my_games' render={() => (
          <div className='main-body'>
            <h2 className='section-header' key='section-header'>My Games</h2>
            <br key='br' />
            <Link to='/my_games/sought' className='sub-section-header' key='my-sought-header'>My Games Sought</Link>
            <GameList firstX={4} gameList={mySoughtGames} key='my-sought-games'/>
            <Link to='/my_games/owned' className='sub-section-header' key='my-owned-header'>My Games Offered</Link>
            <GameList firstX={4} gameList={myOwnedGames} key='my-owned-games'/>
          </div>
        )} />
        <Route exact path='/my_games/sought' render={() => (
          <div className='main-body'>
            <h2 className='section-header' key='my-sought-header'>My Games Sought</h2>
            <GameList firstX={20} gameList={mySoughtGames} key='my-sought-games' />
          </div>
        )} />
        <Route exact path='/my_games/owned' render={() => (
          <div className='main-body'>
            <h2 className='section-header' key='my-owned-header'>My Games Owned</h2>
            <GameList firstX={20} gameList={myOwnedGames} key='my-owned-games' />
          </div>
        )} />
        <Route exact path='/all_games/sought' render={() => (
          <div className='main-body'>
            <h2 className='section-header' key='sought-header'>All Games Sought</h2>
            <GameList firstX={20} gameList={soughtGames} key='sought-games' />
          </div>
        )} />
        <Route exact path='/all_games/owned' render={() => (
          <div className='main-body'>
            <h2 className='section-header' key='owned-header'>All Games Owned</h2>
            <GameList firstX={20} gameList={ownedGames} key='owned-games' />
          </div>
        )} />
        <Route exact path='/game/:id' render={ ({ match }) => {
          console.log('match');
          console.log(match);
          console.log(this.props.GameList);
          let matchingGame = this.props.gameList.find( (game) => String(game._id) === match.params.id);
          return matchingGame?
            <OneGame game={matchingGame} />:
            <p className='no-games'>No Game with ID</p>
        }} />
        <Route exact path='/my_trades' render={ () => (
          <TradeList 
            currentUser={this.props.currentUser}
            tradeList={this.props.tradeList}
            gameList={this.props.gameList}
          />
        )} />   
        <Route exact path='/trade/:id' render={ ({ match }) => {
          if (!this.props.tradeList) return (
            <p className='error'>You must be logged in to see your trades</p>
          );
          let matchingTrade = this.props.tradeList.find( (trade) => String(trade._id) === match.params.id);
          return matchingTrade?
            <OneTrade 
              currentUser={this.props.currentUser}
              trade={matchingTrade}
              gameList={this.props.gameList}
            />:
            <p className='error'>No Trade with that ID</p> 
        }} />
        <Route exact path='/new/trade' render={ () => (
          <TradeSteps 
            soughtGames={soughtGames}
            ownedGames={ownedGames}
            mySoughtGames={mySoughtGames}
            myOwnedGames={myOwnedGames}
          />
        )} />
        <Route exact path='/new/game/sought' render={ () => (
          <AddGame 
            user={this.props.currentUser}
            mySoughtGames={mySoughtGames}
            isGameOwned={false}
          />
        )} />
        <Route exact path='/new/game/owned' render={ () => (
          <AddGame 
            user={this.props.currentUser}
            myOwnedGames={myOwnedGames}
            isGameOwned={true}
          />
        )} />
        <Route render={ () => (
          <div className='error'>Invalid URL</div>
        )} />
      </Switch>
    );
  }
}

MainBody.propTypes = {
  gameList: React.PropTypes.array.isRequired,
  tradeList: React.PropTypes.array,
  filterAllSought: React.PropTypes.func.isRequired,
  filterAllOwned: React.PropTypes.func.isRequired,
  filterMySought: React.PropTypes.func.isRequired,
  filterMyOwned: React.PropTypes.func.isRequired,
  currentUser: React.PropTypes.string,
  saveUser: React.PropTypes.func
}

export default MainBody;