import React, { Component } from 'react';
import Trend from 'react-trend';

import MetricDelta from './Metric-Delta';

import '../styles/Metrics.css';

class Metric extends Component {
  render() {
    let trend = this.props.range ?
      <Trend
        smooth
        data={this.props.range}
        stroke="#5f79fe"
        width={100}
        height={40}
        className="metric-chart"
      /> :
      ''
    ;

    return (
      <div className="metric">
        <div>
          <div className="metric-name">{this.props.name}</div>
          <div className="metric-value">{this.props.value}</div>
        </div>

        <br />

        <div>
          {trend}
          <MetricDelta delta={this.props.delta}/>
        </div>
      </div>
    );
  }
}

export default Metric;
