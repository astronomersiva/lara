import React, { Component } from 'react';

import Metrics from './Metrics';

class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      statistics: {},
      delta: {},
      range: {}
    };
  }

  async componentDidMount() {
    let { project } = this.props;
    let response = await fetch('http://localhost:1511/dashboard', {
      method: 'GET',
      headers: { project }
    });

    let { range, delta, statistics } = await response.json();
    this.setState({ range, delta, statistics });
  }

  render() {
    return (
      <div>
        <Metrics
          statistics={this.state.statistics}
          delta={this.state.delta}
          range={this.state.range}
        />
      </div>
    );
  }
}

export default Dashboard;
