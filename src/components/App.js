import React, { Component } from 'react';
import { BrowserRouter, NavLink, Link } from 'react-router-dom';
import '../scss/App.scss';
import injectTapEventPlugin from 'react-tap-event-plugin';  
import * as d3 from 'd3-request';


// UI components 
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
// import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import MenuItem from 'material-ui/MenuItem';
import Drawer from 'material-ui/Drawer';
import Menu from 'material-ui/svg-icons/navigation/menu';
import Divider from 'material-ui/Divider';

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
  getAllGames(isFake) {
    if (isFake) {
      this.setState({
        gameList: [
          {
            "_id": 1,
            "BGG_id": 28143,
            "user": "hogdog123",
            "sought_or_owned": "sought",
            "BGG_info": {
              "full_image_url": "//cf.geekdo-images.com/images/pic236327.jpg",
              "thumb_image_url": "//cf.geekdo-images.com/images/pic236327_t.jpg",
              "title": "Race for the Galaxy",
              "players_low": 2,
              "players_high": 4,
              "difficulty": 2.9706,
              "minutes_low": 30,
              "minutes_high": 60
            }
          },
          {
            "_id": 2,
            "BGG_id": 55690,
            "user": "hogdog123",
            "sought_or_owned": "owned",
            "BGG_info": {
              "full_image_url": "//cf.geekdo-images.com/images/pic2931007.jpg",
              "thumb_image_url": "//cf.geekdo-images.com/images/pic2931007_t.jpg",
              "title": "Kingdom Death: Monster",
              "players_low": 1,
              "players_high": 6,
              "difficulty": 4.2201,
              "minutes_low": 30,
              "minutes_high": 60
            }
          },
          {
            "_id": 3,
            "BGG_id": 15987,
            "user": "joe2nobody",
            "sought_or_owned": "sought",
            "BGG_info": {
              "full_image_url": "//cf.geekdo-images.com/images/pic175966.jpg",
              "thumb_image_url": "//cf.geekdo-images.com/images/pic175966_t.jpg",
              "title": "Arkham Horror",
              "players_low": 1,
              "players_high": 8,
              "difficulty": 3.5445,
              "minutes_low": 120,
              "minutes_high": 240
            }
          },
          {
            "_id": 4,
            "BGG_id": 178900,
            "user": "joe1nobody",
            "sought_or_owned": "owned",
            "BGG_info": {
              "full_image_url": "//cf.geekdo-images.com/images/pic2582929.jpg",
              "thumb_image_url": "//cf.geekdo-images.com/images/pic2582929_t.jpg",
              "title": "Codenames",
              "players_low": 2,
              "players_high": 8,
              "difficulty": 1.3749,
              "minutes_low": 15,
              "minutes_high": 15
            }
          }
        ]
      });
    } else {
      d3.json('/api/test', (err, data) => {
        if (err) throw err;
        this.setState({
          gameList: data
        });
      });
    }
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
              iconElementLeft={
                <IconButton onTouchTap={ () => this.openDrawer() }>
                  <Menu />
                </IconButton>
              }
              title={<Link to='' className='title-link'>Tabletop Swap</Link>}
              iconClassNameRight="App-logo"
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
