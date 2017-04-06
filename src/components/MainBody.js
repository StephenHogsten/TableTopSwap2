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
import ProxyText from './ProxyTest.js';

import '../scss/MainBody.scss';

class SaveUserAndRedirect extends Component {
  componentWillMount() {
    this.props.saveUser();
  }
  render() {
    return (
      <Redirect to='/' /> 
    );
  }
}
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

class MainBody extends Component {
  componentWillMount() {
    if (this.props.user) return;
    d3Text('/api/checksession', (err, data) => {
      if (err) return;
      if (data) {
        console.log('data: ' + data);
        this.props.saveUser( data );
      }
    });
  }
  // add the add button
  render() {
    let soughtGames = this.props.filterAllSought(this.props.gameList);
    let ownedGames = this.props.filterAllOwned(this.props.gameList);
    let mySoughtGames = this.props.filterMySought(this.props.gameList);
    let myOwnedGames = this.props.filterMyOwned(this.props.gameList);
    let user = this.props.currentUser;

    return (
      <Switch className='main-body-routes'>
        <Route path='/proxyme/:toproxy' component={ProxyText} />
        <Route exact path='/' render={() => {
          let userSpecifics = (!user)? null: [
            (<Link to='/my_games/sought' className='sub-section-header' key='my-sought-header'>My Games Sought</Link>),
            (<GameList firstX={4} gameList={mySoughtGames} key='my-sought-games'/>),
            (<Link to='/my_games/owned' className='sub-section-header' key='my-own)ed-header'>My Games Offered</Link>),
            (<GameList firstX={4} gameList={myOwnedGames} key='my-owned-games'/>),
            (<Divider />),
            (<br />)
          ];
          return (
            <div className='main-body'>
              <h2 className='section-header' key='section-header'>All Games</h2>
              <br key='br' />
              {userSpecifics}
              <Link to='/all_games/sought' className='sub-section-header' key='sought-header'>Games Sought</Link>
              <GameList firstX={4} gameList={soughtGames} key='sought-games'/>
              <Link to='/all_games/owned' className='sub-section-header' key='owned-header'>Games Offered</Link>
              <GameList firstX={4} gameList={ownedGames} key='owned-games'/>
              <AddButton user={user}/>
            </div>
          );
        }} />
        <Route exact path='/login' component={LoginForm} />
        <Route exact path='/login_failed' render={({match}) => (
          <LoginForm failure='true' />
        )}/>
        <Route path='/store_user' render={() => (
          <SaveUserAndRedirect saveUser={() => this.props.saveUser()} />
        )} />
        <Route exact path='/logout' render={ () => (
          <ClearUserAndRedirect clearUser={ () => this.props.clearUser() } user={user} />
        )} />
        <Route exact path='/profile' render={() => 
          user? (
            <Profile user={user} />
          ) : (
            <Redirect to='/' />
          )
        } />
        <Route exact path='/all_games' render={() => (
          <div className='main-body'>
            <h2 className='section-header' key='section-header'>Community Games</h2>
            <br key='br' />
            <Link to='/all_games/sought' className='sub-section-header' key='sought-header'>Games Sought</Link>
            <GameList firstX={4} gameList={soughtGames} key='sought-games'/>
            <Link to='/all_games/owned' className='sub-section-header' key='owned-header'>Games Offered</Link>
            <GameList firstX={4} gameList={ownedGames} key='owned-games'/>
            <AddButton user={user}mode='game' />
          </div>
        )} />
        <Route exact path='/my_games' render={() => 
          user? (
            <div className='main-body'>
              <h2 className='section-header' key='section-header'>My Games</h2>
              <br key='br' />
              <Link to='/my_games/sought' className='sub-section-header' key='my-sought-header'>My Games Sought</Link>
              <GameList firstX={4} gameList={mySoughtGames} key='my-sought-games'/>
              <Link to='/my_games/owned' className='sub-section-header' key='my-owned-header'>My Games Offered</Link>
              <GameList firstX={4} gameList={myOwnedGames} key='my-owned-games'/>
              <AddButton user={user}mode='game' />
            </div>
          ) : (
            <Redirect to='/' />
          )
        } />
        <Route exact path='/my_games/sought' render={() => 
          user? (
            <div className='main-body'>
              <h2 className='section-header' key='my-sought-header'>My Games Sought</h2>
              <GameList firstX={20} gameList={mySoughtGames} key='my-sought-games' />
              <AddButton user={user}mode='sought_game' />
            </div>
          ) : (
            <Redirect to='/' />
          )
        } />
        <Route exact path='/my_games/owned' render={() => 
          user? (
            <div className='main-body'>
              <h2 className='section-header' key='my-owned-header'>My Games Owned</h2>
              <GameList firstX={20} gameList={myOwnedGames} key='my-owned-games' />
              <AddButton user={user}mode='owned_game' />
            </div>
          ) : (
            <Redirect to='/' />
          )
        } />
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
        <Route exact path='/my_trades' render={ () => 
          user? (
            <div>
              <TradeList 
                currentUser={user}
                tradeList={this.props.tradeList}
                gameList={this.props.gameList}
              />
              <AddButton user={user}mode='trade' />
            </div>
          ) : (
            <Redirect to='/' />
          )
        } />
        <Route exact path='/trade/:id' render={ ({ match }) => {
          if (!this.props.tradeList) return (
            <p className='error'>You must be logged in to see your trades</p>
          );
          let matchingTrade = this.props.tradeList.find( (trade) => String(trade._id) === match.params.id);
          return matchingTrade?
            <OneTrade 
              currentUser={user}
              trade={matchingTrade}
              gameList={this.props.gameList}
            />:
            <p className='error'>No Trade with that ID</p> 
        }} />
        <Route exact path='/new/trade' render={ () => 
          user? (
            <TradeSteps 
              soughtGames={soughtGames}
              ownedGames={ownedGames}
              mySoughtGames={mySoughtGames}
              myOwnedGames={myOwnedGames}
            />
          ) : (
            <Redirect to='/' />
          )
        } />
        <Route exact path='/new/game/sought' render={ () =>
          user ? (
            <AddGame 
              user={user}
              mySoughtGames={mySoughtGames}
              isGameOwned={false}
            />
          ) : (
            <Redirect to='/' />
          )
        } />
        <Route exact path='/new/game/owned' render={ () => 
          user? (
            <AddGame 
              user={user}
              myOwnedGames={myOwnedGames}
              isGameOwned={true}
            />
          ) : (
            <Redirect to='/' />
          )
        } />
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
  saveUser: React.PropTypes.func.isRequired,
  clearUser: React.PropTypes.func.isRequired
}

export default MainBody;