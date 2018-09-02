function formatBytes(bytes) {
  bytes = Number(bytes);
  if (bytes === 0) {
    return '0 Bytes';
  }

  let k = 1024;
  let decimals = 3;
  let sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  let i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`;
}

function isNumber(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

module.exports = function(json) {
  let allowedMetrics = [
    'total-stylesheet-size',
    'total-media-queries',
    'media-queries',
    'total-rules',
    'selectors-per-rule',
    'total-selectors',
    'identifiers-per-selector',
    'specificity-per-selector',
    'top-selector-specificity',
    'total-id-selectors',
    'total-identifiers',
    'total-declarations',
    'total-unique-colours',
    'unique-colours',
    'total-important-keywords',
  ];

  let formattedMetrics = Object.assign({}, json);

  for (const metric in json) {
    if (!allowedMetrics.includes(metric)) {
      delete formattedMetrics[metric];
    }

    let value = formattedMetrics[metric];
    if (metric === 'total-stylesheet-size') {
      formattedMetrics[metric] = formatBytes(value);
    } else if (isNumber(value) && !Number.isInteger(value)) {
      formattedMetrics[metric] = Number(value.toFixed(3));
    }
  }

  return formattedMetrics;
}
