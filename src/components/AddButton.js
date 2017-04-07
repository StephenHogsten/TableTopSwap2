// switch this to have different add buttons for different places

import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { json as d3Json } from 'd3-request';

import FloatingActionButton from 'material-ui/FloatingActionButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import ContentAddIcon from 'material-ui/svg-icons/content/add';

import '../scss/AddButton.scss';

const SingleActionButton = ({onTouchTap}) => (
  <div className='add-button-container'>
    <FloatingActionButton
      secondary={true}
      children={<ContentAddIcon />}
      onTouchTap={ onTouchTap }
    />
  </div>
);

class AddButton extends Component {
  render() {
    if (!this.props.user) return <span />;
    let menuItems = [];
    console.log('mode: ' + this.props.mode);
    switch (this.props.mode) {
      case undefined:
      case 'all':
        menuItems.push(<MenuItem key='trade' primaryText="Trade Request" onTouchTap={ () => { this.props.history.push('/new/trade') }} />);
      case 'game':
        menuItems.push(<MenuItem key='wanted-game' primaryText="Wanted Game" onTouchTap={ () => { this.props.history.push('/new/game/sought')}} />);
        menuItems.push(<MenuItem key='owned-game' primaryText="Owned Game" onTouchTap={ () => { this.props.history.push('/new/game/owned') }} />);
        break;
      case 'owned_game':
        return (
          <SingleActionButton onTouchTap={ () => this.props.history.push('/new/game/owned') } />
        );
      case 'sought_game':
        return (
          <SingleActionButton onTouchTap={ () => this.props.history.push('/new/game/sought') } />
        )
      case 'trade':
        return (
          <SingleActionButton onTouchTap={ () => this.props.history.push('/new/trade') } />
        );
      case 'trade_sender':
        return (
          <SingleActionButton onTouchTap={ () => this.props.history.push('/new/trade/sender/' + encodeURIComponent(JSON.stringify(this.props.game))) } />
        );
      case 'trade_receiver':
        return (
          <SingleActionButton onTouchTap={ () => this.props.history.push('/new/trade/receiver/' + encodeURIComponent(JSON.stringify(this.props.game))) } />
        );
      default:
        console.log('error');
        menuItems.push(<MenuItem primaryText="error" />);
    }
    return (
      <div className='add-button-container'>
        <IconMenu
          iconButtonElement={<FloatingActionButton secondary={true} children={<ContentAddIcon />} />}
          anchorOrigin={{horizontal: 'middle', vertical: 'center'}}
          targetOrigin={{horizontal: 'right', vertical: 'bottom'}}
        >
          {menuItems}
        </IconMenu>
      </div>
    );
  }
}

AddButton.propTypes = {
  mode: React.PropTypes.string,
  user: React.PropTypes.string,
  game: React.PropTypes.object
};

export default withRouter(AddButton);