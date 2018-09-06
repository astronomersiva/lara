import React, { Component } from 'react';

import Metric from './Metric';

class Metrics extends Component {
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
          name={metric.name}
          value={this.props.statistics[metric.key]}
          delta={this.props.delta[metric.key]}
          range={this.props.range[metric.key]}
        />
      );
    });

    return <div className="metrics">{metricBlocks}</div>;
  }
}

export default Metrics;
