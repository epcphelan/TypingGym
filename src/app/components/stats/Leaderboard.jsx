import React from 'react';
import PropTypes from 'prop-types';

const Leaderboard = ({ rollingStats }) => {
  return (
    <div className="leader-board">
      <div className="statistic">
        <div className="label">Accuracy</div>
        <div className="value">{Math.round(rollingStats.accuracy)}% </div>
      </div>
      <div className="statistic">
        <div className="label">WPM</div>
        <div className="value"> {rollingStats.wpm} </div>
      </div>
      <div className="statistic">
        <div className="label">Words</div>
        <div className="value">{Math.round(rollingStats.words)} </div>
      </div>
      <div className="statistic">
        <div className="label">Errors</div>
        <div className="value">
          {rollingStats.touched - rollingStats.correct + rollingStats.corrected}
        </div>
      </div>
      <div className="statistic">
        <div className="label">Corrected</div>
        <div className="value"> {rollingStats.corrected} </div>
      </div>
    </div>
    );
};

Leaderboard.propTypes = {
  rollingStats: PropTypes.object,
};
Leaderboard.defaultProps = {};

export default Leaderboard;
