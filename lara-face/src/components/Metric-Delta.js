import React, { Component } from 'react';

class MetricDelta extends Component {
  render() {
    let { delta = 0 } = this.props;
    let change = 'increase';

    if (delta < 0) {
      change = 'decrease';
      delta = delta * -1;
    }

    if (delta === 0 || delta === null) {
      return '';
    }

    return (
      <div className={`metric-delta metric-delta__${change}`}>
        {delta} %
      </div>
    );
  }
}

export default MetricDelta;
