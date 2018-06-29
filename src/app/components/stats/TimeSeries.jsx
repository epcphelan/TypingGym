import React, { Component } from "react";
import PropTypes from "prop-types";
import { snapshotActiveTest } from "../../actions";
import TimeSeriesDataPoint from "./TimeSeriesDataPoint";
import { calculateTrailingAvgPerformance } from "./Utils";

class TimeSeries extends Component {
  constructor(props) {
    super(props);
    this.dispatch = this.props.dispatch;
  }
  doTimeout() {
    const self = this;
    self.timer = setTimeout(() => {
      self.takeTimeSeriesSnapshot();
      self.doTimeout();
    }, 1000);
  }
  takeTimeSeriesSnapshot() {
    this.dispatch(snapshotActiveTest());
  }
  renderPlot() {
    const calculatePointInRange = (top, bottom, value) =>
      ((value - bottom) / (top - bottom)) * 100;
    const maxAccuracy = 100;
    const minAccuracy = this.props.rollingStats.accuracyMin * 0.75;
    const maxWPM = this.props.rollingStats.wpmMax * 1.5;
    const minWPM = this.props.rollingStats.wpmMin * 0.7;
    const trailingPerformance = calculateTrailingAvgPerformance(
      this.props.stringMap
    );
    return trailingPerformance.map((item, index) => {
      const accuracyPoint = calculatePointInRange(
        maxAccuracy,
        minAccuracy,
        item.accuracy
      );
      const accuracyStyle = {
        height: `${accuracyPoint}%`
      };
      const wpmPoint = calculatePointInRange(maxWPM, minWPM, item.wpm);
      const wpmStyle = {
        height: `${wpmPoint}%`
      };
      return (
        <TimeSeriesDataPoint
          key={index}
          accuracyStyle={accuracyStyle}
          wpmStyle={wpmStyle}
        />
      );
    });
  }

  render() {
    if (this.props.shouldDisplayComplete === true) {
      return <div className="stats-series">{this.renderPlot()}</div>;
    } else {
      return <div className="stats-series" />;
    }
  }
}

TimeSeries.propTypes = {
  dispatch: PropTypes.func,
  snapshots: PropTypes.array,
  activeTest: PropTypes.bool,
  rollingStats: PropTypes.object,
  currentPosition: PropTypes.number,
  stringMap: PropTypes.array,
  shouldDisplayComplete: PropTypes.bool
};
TimeSeries.defaultProps = {};

export default TimeSeries;
