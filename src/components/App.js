import React, { Component } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import '../scss/App.scss';
import injectTapEventPlugin from 'react-tap-event-plugin';  
import * as d3 from 'd3-request';


// UI components 
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import Menu from 'material-ui/svg-icons/navigation/menu';
import IconButton from 'material-ui/IconButton';

//  my components
import MainBody from './MainBody.js';
import {displayOptions, gameDisplayOptions, tradeDisplayOptions} from './enums.js';

class App extends Component {
  constructor() {
    super();
    injectTapEventPlugin(); 
    this.state = {
      gameList: [],
      currentUser: null,
      display: displayOptions.games,
      displayOption: gameDisplayOptions.all
    };
  }
  componentDidMount() {
    this.getAllGames(true);
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
  
  filterMySought(gameList) {
    return gameList.filter( (game) => game.sought_or_owned === 'sought' && game.user === this.state.currentUser );
  }
  filterMyOwned(gameList) {
    return gameList.filter( (game) => game.sought_or_owned === 'owned' && game.user === this.state.currentUser );
  }
  filterAllSought(gameList) {
    return gameList.filter( (game) => game.sought_or_owned === 'sought' && game.user !== this.state.currentUser );
  }
  filterAllOwned(gameList) {
    return gameList.filter( (game) => game.sought_or_owned === 'owned' && game.user !== this.state.currentUser );
  }
  render() {
    return (
      <Router> 
        <MuiThemeProvider>
          <div>
            <AppBar 
              iconElementLeft={<IconButton><Menu /></IconButton>}
              title="Tabletop Swap"
              iconClassNameRight="App-logo"
            />

            <div className="app-sidebar">
            </div>

            <MainBody 
              gameList={this.state.gameList}
              filterAllSought={(gameList) => this.filterAllSought(gameList)}
              filterAllOwned={(gameList) => this.filterAllOwned(gameList)}
              filterMySought={(gameList) => this.filterMySought(gameList)}
              filterMyOwned={(gameList) => this.filterMyOwned(gameList)}
            />
          </div>
        </MuiThemeProvider>
      </Router>
    );
  }
}

export default App;
