import React, { Component } from 'react';
import { BrowserRouter, NavLink } from 'react-router-dom';
import '../scss/App.scss';
import injectTapEventPlugin from 'react-tap-event-plugin';  
import * as d3 from 'd3-request';


// UI components 
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import MenuItem from 'material-ui/MenuItem';
import Drawer from 'material-ui/Drawer';
import Divider from 'material-ui/Divider';

//  my components
import MainBody from './MainBody.js';
import TopBar from './TopBar.js';


const MenuLink = ({to, label, clickFn}) => (
  <NavLink to={'/' + to}>
    <MenuItem primaryText={label} onTouchTap={clickFn}/>
  </NavLink>
);

class App extends Component {
  constructor() {
    super();
    injectTapEventPlugin(); 
    this.state = {
      gameList: [],
      tradeList: [],
      currentUser: null,
      isCheckingSession: true,
      isDrawerOpen: false,
      lastUpdated: new Date()
    };
  }
  componentWillMount() {
    d3.json('/api/checksession', (err, data) => {
      if (err) {
        this.setState({ isCheckingSession: false });
      }
      this.setState({
        currentUser: data._id,
        isCheckingSession: false
      });
    });
  }
  componentDidMount() {
    this.getAllGames();
  }
  componentWillUpdate(nextProps, nextState) {
    if (!this.state.currentUser && nextState.currentUser) {
      this.getAllTrades(nextState.currentUser);
    }
  }
  getAllGames() {
    d3.json('/api/all_games', (err, data) => {
      if (err) throw err;
      this.setState({
        gameList: data
      });
    });
  }
  getAllTrades(user) {
    user = user? user: this.state.currentUser;
    if (!user) return;
    d3.json('/api/all_trades', (err, data) => {
      if (err) throw err;
      console.log(data);
      console.log('user: ', user);
      console.log(data.filter((d) => (d.sender.user === user || d.recipient.user === user)));
      this.setState({
        tradeList: data.filter((d) => (d.sender.user === user || d.recipient.user === user))
      });
    });
  }
  saveUser(username) {
    d3.json('/api/checksession', (err, data) => {
      console.log('saveUser user:');
      console.log(data);
      if (data.username) {
        this.setState({ currentUser: data._id});
      } else {
        this.setState({ currentUser: null });
      }
    });
  }
  clearUser() {
    this.setState({
      currentUser: null
    });
  }
  openDrawer() {
    this.setState({ isDrawerOpen: true });
  }
  closeDrawer() {
    this.setState({ isDrawerOpen: false });
  }
  
  filterParent(gameList, soughtOrOwned, isUser, filterAccepted=true) {
    return gameList.filter( (game) => {
      if (game.sought_or_owned !== soughtOrOwned) return false;
      if ( (game.user === this.state.currentUser) !== isUser ) return false;
      if (filterAccepted && (game.isTradeAccepted)) return false;
      return true;
    })
  }
  render() {
    const drawer = this.state.currentUser? (
      <Drawer 
        docked={false}
        open={this.state.isDrawerOpen} 
        onRequestChange={ () => this.closeDrawer() }
      >
        <MenuLink to="" label="All Games" clickFn={()=>this.closeDrawer()} />
        <Divider />
        <MenuLink to="my_games" label="My Games" clickFn={()=>this.closeDrawer()} />
        <MenuLink to="my_games/sought" label="  Games I Want" clickFn={()=>this.closeDrawer()} />
        <MenuLink to="my_games/owned" label="  Games I'm Offering" clickFn={()=>this.closeDrawer()} />
        <MenuLink to="my_trades" label="My Trades" clickFn={()=>this.closeDrawer()} />
        <Divider />
        <MenuLink to="all_games" label="Community Games" clickFn={()=>this.closeDrawer()} />
        <MenuLink to="all_games/sought" label="  Games Others Want" clickFn={()=>this.closeDrawer()} />
        <MenuLink to="all_games/owned" label="  Games Others Offer" clickFn={()=>this.closeDrawer()} />
      </Drawer>
    ) : (
      <Drawer 
        docked={false}
        open={this.state.isDrawerOpen} 
        onRequestChange={ () => this.closeDrawer() }
      >
        <MenuLink to="all_games" label="Community Games" clickFn={()=>this.closeDrawer()} />
        <MenuLink to="all_games/sought" label="  Games Others Want" clickFn={()=>this.closeDrawer()} />
        <MenuLink to="all_games/owned" label="  Games Others Offer" clickFn={()=>this.closeDrawer()} />
      </Drawer>
    );

    return (
      <MuiThemeProvider>
        <BrowserRouter>   
          <div>
            <TopBar 
              currentUser={this.state.currentUser} 
              openDrawer={ () => this.openDrawer() }
            />

            {drawer}

            <MainBody 
              currentUser={this.state.currentUser}
              isCheckingSession={this.state.isCheckingSession}
              gameList={this.state.gameList}
              tradeList={this.state.tradeList}
              saveUser={ (username) => this.saveUser(username) }
              clearUser={ () => this.clearUser() }
              filterAllSought={(gameList) => this.filterParent(gameList, 'sought', false)}
              filterAllOwned={(gameList) => this.filterParent(gameList, 'owned', false)}
              filterMySought={(gameList) => this.filterParent(gameList, 'sought', true)}
              filterMyOwned={(gameList) => this.filterParent(gameList, 'owned', true)}
            />
          </div>
        </BrowserRouter>    
      </MuiThemeProvider>
    );
  }
}


export default App;
