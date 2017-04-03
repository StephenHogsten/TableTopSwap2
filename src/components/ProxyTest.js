import React, {Component} from 'react';
import { text } from 'd3-request';

class ProxyTest extends Component {
  constructor({match}) {
    super();
    this.state = {
      text: 'waiting',
      location: '/api/' + decodeURIComponent( match.params.toproxy )
    };
  }
  componentDidMount() {
    text(this.state.location, (err, data) => {
      if (err) {
        this.setState({
          text: 'error' + err
        });
      } else {
        this.setState({
          text: data
        });
      }
    });
  }
  render() {
    return (
      <div>
        <h1>response</h1>
        <p>{this.state.text}</p>
      </div>
    );
  }
}

export default ProxyTest;