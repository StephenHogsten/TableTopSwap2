import React, { Component } from 'react';
import { Link } from 'react-router-dom';
// import '../scss/Game.scss';

import Paper from 'material-ui/Paper';

class TradeCard extends Component {
  render() {
    let status = this.props.trade.status;
    return (
      <Link to={'trade/' + this.props.trade._id} class='trade-card'>
        <div className={'trade-header trade-status-' + status}>{status}</div>
        <Paper>
          <div>First picture</div>
          <div>First title</div>
          <div>First avatar</div>
          <div>First username</div>
        </Paper>
        <div>Arrow Right</div>
        <div>Arrow Left</div>
        <Paper>
          <div>Second picture</div>
          <div>Second title</div>
          <div>Second avatar</div>
          <div>Second username</div>
        </Paper>

      </Link>
    );
  }
}

TradeCard.propTypes = {
  trade: React.PropTypes.object.isRequired
}

export default TradeCard;