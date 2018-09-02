import React, { Component } from 'react';

import Metric from './Metric';

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
    let metrics = [
      { key: 'total-stylesheet-size', name: 'File Size' },
      { key: 'selectors-per-rule', name: 'Selectors Per Rule' },
      { key: 'specificity-per-selector', name: 'Specificity Per Selector' },
      { key: 'top-selector-specificity', name: 'Top Specificity' },
      { key: 'total-declarations', name: 'Total Declarations' },
      { key: 'total-id-selectors', name: 'Total ID Selectors' },
      { key: 'total-identifiers', name: 'Total IDs' },
      { key: 'total-important-keywords', name: 'Total !important' },
      { key: 'total-media-queries', name: 'Media Queries' },
      { key: 'total-rules', name: 'Total Rules' },
      { key: 'total-selectors', name: 'Total Selectors' },
      { key: 'identifiers-per-selector', name: 'IDs per selector' },
      { key: 'total-unique-colours', name: 'Unique Colors' }
    ];

    const metricBlocks = metrics.map((metric) => {
      return (
        <Metric
          key={metric.key}
          param={metric.key}
          value={this.state.statistics[metric.key]}
          delta={this.state.delta[metric.key]}
          range={this.state.range[metric.key]}
          name={metric.name}
        />
      );
    });

    return <div className="dashboard">{metricBlocks}</div>;
  }
}

export default Dashboard;
