import React, { Component } from 'react';
import { BrowserRouter, NavLink, Link } from 'react-router-dom';
import '../scss/App.scss';
import injectTapEventPlugin from 'react-tap-event-plugin';  
import * as d3 from 'd3-request';


// UI components 
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import MenuItem from 'material-ui/MenuItem';
import Drawer from 'material-ui/Drawer';
import Divider from 'material-ui/Divider';
import FlatButton from 'material-ui/FlatButton';
import MenuIcon from 'material-ui/svg-icons/navigation/menu';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';

//  my components
import MainBody from './MainBody.js';


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
      isDrawerOpen: false
    };
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
    d3.json('/api/test', (err, data) => {
      if (err) throw err;
      this.setState({
        gameList: data
      });
    });
  }
  getAllTrades(user) {
    user = user? user: this.state.currentUser;
    if (!user) return;
    d3.json('/api/testTrade', (err, data) => {
      if (err) throw err;
      console.log(data);
      this.setState({
        tradeList: data.filter((d) => (d.sender.user === user || d.recipient.user === user))
      });
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
    return (
      <BrowserRouter> 
        <MuiThemeProvider>
          <div>
            <AppBar 
              className='white-font'
              iconElementLeft={
                <IconButton onTouchTap={ () => this.openDrawer() }>
                  <MenuIcon />
                </IconButton>
              }
              title={<Link to='' className='title-link'>Tabletop Swap</Link>}
              iconElementRight={
                this.state.currentUser?
                <IconMenu
                  iconButtonElement={
                    <IconButton><MoreVertIcon /></IconButton>
                  }
                  targetOrigin={{horizontal: 'right', vertical: 'top'}}
                  anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                >
                  <MenuItem primaryText="View Profile" />
                  <MenuItem primaryText="Sign out" />
                </IconMenu>:
                <FlatButton label='Login' className='white-font'/>
              }
            />

            <Drawer 
              docked={false}
              open={this.state.isDrawerOpen} 
              onRequestChange={ () => this.closeDrawer() }
            >
              <MenuLink to="my_games" label="My Games" clickFn={()=>this.closeDrawer()} />
              <MenuLink to="my_games/sought" label="  Games I Want" clickFn={()=>this.closeDrawer()} />
              <MenuLink to="my_games/owned" label="  Games I'm Offering" clickFn={()=>this.closeDrawer()} />
              <MenuLink to="my_trades" label="Trades" clickFn={()=>this.closeDrawer()} />
              <MenuLink to="new/trade" label="Test Trade" clickFn={()=>this.closeDrawer()} />
              <MenuLink to="new/game/sought" label="Test add" clickFn={()=>this.closeDrawer()} />
              <Divider />
              <MenuLink to="" label="All Games" clickFn={()=>this.closeDrawer()} />
              <MenuLink to="all_games" label="Community Games" clickFn={()=>this.closeDrawer()} />
              <MenuLink to="all_games/sought" label="  Games Others Want" clickFn={()=>this.closeDrawer()} />
              <MenuLink to="all_games/owned" label="  Games Others Offer" clickFn={()=>this.closeDrawer()} />
            </Drawer>

            <MainBody 
              currentUser={this.state.currentUser}
              gameList={this.state.gameList}
              tradeList={this.state.tradeList}
              filterAllSought={(gameList) => this.filterParent(gameList, 'sought', false)}
              filterAllOwned={(gameList) => this.filterParent(gameList, 'owned', false)}
              filterMySought={(gameList) => this.filterParent(gameList, 'sought', true)}
              filterMyOwned={(gameList) => this.filterParent(gameList, 'owned', true)}
            />
          </div>
        </MuiThemeProvider>
      </BrowserRouter>
    );
  }
}


export default App;
