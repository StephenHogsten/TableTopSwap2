import React, {Component} from 'react';
import { Link, withRouter } from 'react-router-dom';

import AppBar from 'material-ui/AppBar';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton';
import MenuIcon from 'material-ui/svg-icons/navigation/menu';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';

const MenuLink = ({to, label, clickFn}) => (
  <Link to={'/' + to}>
    <MenuItem primaryText={label} className='title-link' onTouchTap={clickFn}/>
  </Link>
);

class TopBar extends Component {
  render() {
    return (
      <AppBar 
        iconElementLeft={
          <IconButton onTouchTap={ () => this.props.openDrawer() }>
            <MenuIcon />
          </IconButton>
        }
        title={<Link to='' className='title-link'>Tabletop Swap</Link>}
        iconElementRight={
          this.props.currentUser?
          <IconMenu
            iconButtonElement={
              <IconButton><MoreVertIcon /></IconButton>
            }
            targetOrigin={{horizontal: 'right', vertical: 'top'}}
            anchorOrigin={{horizontal: 'right', vertical: 'top'}}
          >
            <MenuItem 
              primaryText='View Profile' 
              onTouchTap={ () => this.props.history.push('/profile') }
            />
            <MenuItem
              primaryText='Logout'
              onTouchTap={ () => this.props.history.push('/logout') }
            />
          </IconMenu>:
          <FlatButton label='Login' onClick={ () => {
            this.props.history.push('/login')
          }}/>
        }
      />
    );
  }
}

TopBar.PropTypes = {
  currentUser: React.PropTypes.string,
  openDrawer: React.PropTypes.func.isRequired,
  closeDrawer: React.PropTypes.func.isRequired
};

export default withRouter(TopBar);