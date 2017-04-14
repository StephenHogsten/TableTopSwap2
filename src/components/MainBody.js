import React, { Component } from 'react';
import { Switch, Route, Link, Redirect } from 'react-router-dom';

import { text as d3Text } from 'd3-request';

import Divider from 'material-ui/Divider';

import GameList from './GameList.js';
import TradeList from './TradeList.js';
import OneGame from './OneGame.js';
import OneTrade from './OneTrade.js';
import TradeSteps from './TradeSteps.js';
import AddGame from './AddGame.js';
import Profile from './Profile.js';
import LoginForm from './LoginForm.js';
import AddButton from './AddButton.js';
import Loading from './Loading.js';

import '../scss/MainBody.scss';

class ClearUserAndRedirect extends Component {
  componentWillMount() {
    d3Text('/api/logout', (err, data) => {
      if (err) throw err;
    });
    this.props.clearUser();
  }
  render() {
    return (
      (this.props.user)?
      <div className='error'>Logging you out...</div>:
      <Redirect to='/' />
    );
  }
}

// expects: 
//   isCheckingSession (bool)
//   currenUser        (string)
//   render            (function for what to render)
const UserRender = (props) => {
  if (props.isCheckingSession) {
    return (
      <Loading />
    );
  }
  if (!props.currentUser) {
    sessionStorage.setItem('path', window.location.pathname);
    return (
      <Redirect to='/login/'  />
    );
  }
  return props.render();
}

class MainBody extends Component {
  // add the add button
  render() {
    let soughtGames = this.props.filterAllSought(this.props.gameList);
    let ownedGames = this.props.filterAllOwned(this.props.gameList);
    let mySoughtGames = this.props.filterMySought(this.props.gameList);
    let myOwnedGames = this.props.filterMyOwned(this.props.gameList);
    let user = this.props.currentUser;
    console.log('user', user);
    console.log('test', user? true: false);

    return (
      <Switch className='main-body-routes'>
        <Route key='test' path='/testspin' render={() => (
          <UserRender isCheckingSession={true} />
        )} />
        <Route key='home' exact path='/' render={() => {
          let userSpecifics = (!user)? null: [
            (<Link to='/my_games' className='section-header' key='header'>My Games</Link>),
            (<Link to='/my_games/sought' className='sub-section-header' key='my-sought-header'>My Games Sought</Link>),
            (<GameList firstX={3} gameList={mySoughtGames} isOwned={false} seeMoreLink='/my_games/sought' key='my-sought-games'/>),
            (<Link to='/my_games/owned' className='sub-section-header' key='my-own)ed-header'>My Games Offered</Link>),
            (<GameList firstX={3} gameList={myOwnedGames} isOwned={true} seeMoreLink='/my_games/owned' key='my-owned-games'/>),
            (<Divider className='section-divider' key='divider'/>),
            (<br key='br'/>)
          ];
          return (
            <div className='main-body'>
              {userSpecifics}
              <Link to='/all_games' className='section-header' key='section-header'>Community Games</Link>
              <Link to='/all_games/sought' className='sub-section-header' key='sought-header'>Games Sought</Link>
              <GameList firstX={3} gameList={soughtGames} seeMoreLink='/all_games/sought' key='sought-games'/>
              <Link to='/all_games/owned' className='sub-section-header' key='owned-header'>Games Offered</Link>
              <GameList firstX={3} gameList={ownedGames} seeMoreLink='/all_games/owned' key='owned-games'/>
              <AddButton user={user}/>
            </div>
          );
        }} />
        <Route key='login' exact path='/login/' component={({...rest}) => (
          user? <Redirect to='/' />: <LoginForm {...rest} />
        )} />
        <Route key='login_info' exact path='/login/:info' component={({...rest}) => (
          user? <Redirect to='/' />: <LoginForm {...rest} />
        )} />
        <Route key='logged_in' exact path='/logged_in' render={() => {
          let oldPath = sessionStorage.getItem('path') || '/';
          sessionStorage.clear();
          return <Redirect to={oldPath} />
        }} />
        <Route key='logout' exact path='/logout' render={ () => (
          <ClearUserAndRedirect clearUser={ () => this.props.clearUser() } user={user} />
        )} />
        <Route key='profile' exact path='/profile' render={() => 
          <UserRender currentUser={user} isCheckingSession={this.props.isCheckingSession} render={() => (
            <div className='main-body'>
              <Profile currentUser={user} trades={this.props.tradeList} games={this.props.gameList} />
            </div>
          )} />
        } />
        <Route key='all' exact path='/all_games' render={() => (
          <div className='main-body'>
            <span className='section-header' key='section-header'>Community Games</span>
            <Link to='/all_games/sought' className='sub-section-header' key='sought-header'>Games Sought</Link>
            <GameList firstX={3} gameList={soughtGames} seeMoreLink='/all_games/sought' key='sought-games' isOwned={false}/>
            <Link to='/all_games/owned' className='sub-section-header' key='owned-header'>Games Offered</Link>
            <GameList firstX={3} gameList={ownedGames} seeMoreLink='/all_games/owned' key='owned-games' isOwned={true}/>
            <AddButton user={user} mode='game' />
          </div>
        )} />
        <Route key='my' exact path='/my_games' render={() => 
          <UserRender currentUser={user} isCheckingSession={this.props.isCheckingSession} render={() => (
            <div className='main-body'>
              <span className='section-header' key='section-header'>My Games</span>
              <Link to='/my_games/sought' className='sub-section-header' key='my-sought-header'>My Games Sought</Link>
              <GameList firstX={3} gameList={mySoughtGames} isOwned={false} seeMoreLink='/my_games/sought' key='my-sought-games'/>
              <Link to='/my_games/owned' className='sub-section-header' key='my-owned-header'>My Games Offered</Link>
              <GameList firstX={3} gameList={myOwnedGames} isOwned={true} seeMoreLink='/my_games/owned' key='my-owned-games'/>
              <AddButton user={user} mode='game' />
            </div>
          )} />
        } />
        <Route key='my_sought' exact path='/my_games/sought' render={() => 
          <UserRender currentUser={user} isCheckingSession={this.props.isCheckingSession} render={() => (
            <div className='main-body'>
              <h2 className='section-header' key='my-sought-header'>My Games Sought</h2>
              <GameList gameList={mySoughtGames} isOwned={false} key='my-sought-games' />
              <AddButton user={user} mode='sought_game' />
            </div>
          )} />
        } />
        <Route key='my_owned' exact path='/my_games/owned' render={() => 
          <UserRender currentUser={user} isCheckingSession={this.props.isCheckingSession} render={() => (
            <div className='main-body'>
              <h2 className='section-header' key='my-owned-header'>My Games Owned</h2>
              <GameList gameList={myOwnedGames} isOwned={true} key='my-owned-games' />
              <AddButton user={user} mode='sought_game' />
            </div>
          )} />
        } />
        <Route key='community_sought' exact path='/all_games/sought' render={() => (
          <div className='main-body'>
            <h2 className='section-header' key='sought-header'>All Games Sought</h2>
            <GameList gameList={soughtGames} key='sought-games' />
          </div>
        )} />
        <Route key='community_owned' exact path='/all_games/owned' render={() => (
          <div className='main-body'>
            <h2 className='section-header' key='owned-header'>All Games Owned</h2>
            <GameList gameList={ownedGames} gameType='owned' key='owned-games' />
          </div>
        )} />
        <Route key='game' exact path='/game/:id' render={ ({ match }) => {
          let matchingGame = this.props.gameList.find( (game) => String(game._id) === match.params.id);
          return matchingGame?
            <OneGame game={matchingGame} user={user} />:
            <p className='no-games'>No Game with ID</p>
        }} />
        <Route key='trades' exact path='/my_trades' render={ () => 
          <UserRender currentUser={user} isCheckingSession={this.props.isCheckingSession} render={() => (
            <div className='main-body'>
              <TradeList 
                currentUser={user}
                tradeList={this.props.tradeList}
                gameList={this.props.gameList}
              />
              <AddButton user={user} mode='trade' />
            </div>
          )} />
        } />
        <Route key='trade' exact path='/trade/:id' render={ ({ match }) => {
          let matchingTrade = this.props.tradeList.find( (trade) => String(trade._id) === match.params.id);
          return matchingTrade?
            <div className='main-body'>
              <OneTrade 
                currentUser={user}
                trade={matchingTrade}
                gameList={this.props.gameList}
                expanded={true}
                refreshTrades={this.props.refreshTrades}
                refreshGames={this.props.refreshGames}
              />
            </div>:
            <div className='main-body'><p className='error'>No Trade with that ID</p></div>
        }} />
        <Route key='new_trade' exact path='/new/trade' render={ () => 
          <UserRender currentUser={user} isCheckingSession={this.props.isCheckingSession} render={() => (
            <div className='main-body'>
              <TradeSteps 
                soughtGames={soughtGames}
                ownedGames={ownedGames}
                mySoughtGames={mySoughtGames}
                myOwnedGames={myOwnedGames}
                refreshTrades={this.props.refreshTrades}
                refreshGames={this.props.refreshGames}
              />
            </div>
          )} />
        } />
        <Route key='new_trade_sender' path='/new/trade/sender/:game' render={ ({match}) => (
          <UserRender currentUser={user} isCheckingSession={this.props.isCheckingSession} render={() => (
            <div className='main-body'>
              <TradeSteps 
                soughtGames={soughtGames}
                ownedGames={ownedGames}
                mySoughtGames={mySoughtGames}
                myOwnedGames={myOwnedGames}
                myOwnedGame={JSON.parse(decodeURIComponent(match.params.game))}
                refreshTrades={this.props.refreshTrades}
                refreshGames={this.props.refreshGames}
              />
            </div>
          )} />
        )} />
        <Route key='new_trade_receiver' path='/new/trade/receiver/:game' render={ ({match}) => (
          <UserRender currentUser={user} isCheckingSession={this.props.isCheckingSession} render={() => (
            <div className='main-body'>
              <TradeSteps 
                soughtGames={soughtGames}
                ownedGames={ownedGames}
                mySoughtGames={mySoughtGames}
                myOwnedGames={myOwnedGames}
                ownedGame={JSON.parse(decodeURIComponent(match.params.game))}
                refreshTrades={this.props.refreshTrades}
                refreshGames={this.props.refreshGames}
              />
            </div>
          )} />
        )} />
        <Route key='new_sought' exact path='/new/game/sought' render={ () =>
          <UserRender currentUser={user} isCheckingSession={this.props.isCheckingSession} render={() => (
            <div className='main-body'>
              <AddGame 
                user={user}
                mySoughtGames={mySoughtGames}
                isGameOwned={false}
                refreshGames={this.props.refreshGames}
              />
            </div>
          )} />
        } />
        <Route key='new_owned' exact path='/new/game/owned' render={ () => 
          <UserRender currentUser={user} isCheckingSession={this.props.isCheckingSession} render={() => (
            <div className='main-body'>
              <AddGame 
                user={user}
                myOwnedGames={myOwnedGames}
                isGameOwned={true}
                refreshGames={this.props.refreshGames}
              />
            </div>
          )} />
        } />
        <Route key='error' render={ () => (
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
  refreshGames: React.PropTypes.func.isRequired,
  refreshTrades: React.PropTypes.func.isRequired,
  currentUser: React.PropTypes.string,
  isCheckingSession: React.PropTypes.bool.isRequired,
  clearUser: React.PropTypes.func.isRequired
}

export default MainBody;