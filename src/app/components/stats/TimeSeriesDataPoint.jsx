import React, { Component } from 'react';
import PropTypes from 'prop-types';

class TimeSeriesDataPoint extends Component {
  shouldComponentUpdate(nextProps) {
    return this.props.accuracyStyle !== nextProps.accuracyStyle
      || this.props.wpmStyle !== nextProps.wpmStyle;
  }
  render() {
    const { accuracyStyle, wpmStyle } = this.props;
    return (
      <div className="data-point">
        <div className="accuracy" key="accuracy" style={accuracyStyle} />
        <div className="wpm" key="wpm" style={wpmStyle} />
      </div>
    );
  }
}

TimeSeriesDataPoint.propTypes = {
  accuracyStyle: PropTypes.object,
  wpmStyle: PropTypes.object,
};
TimeSeriesDataPoint.defaultProps = {};

export default TimeSeriesDataPoint;
