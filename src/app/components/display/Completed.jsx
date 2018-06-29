import React, { Component } from "react";
import PropTypes from "prop-types";
import { classes } from "../common/utils";
import { loadNewText } from "../../actions";

class Completed extends Component {
  static calculateStatsDeltas(stats, prevStats) {
    const deltas = {
      wpm: null,
      accuracy: null,
      words: null,
      errors: null,
      corrected: null
    };
    if (prevStats && prevStats.rollingStats) {
      const prev = prevStats.rollingStats;
      const prevErrors = prev.touched - prev.corrected - prev.correct;
      const errors = stats.touched - stats.corrected - stats.correct;
      deltas.wpm = stats.wpm - prev.wpm;
      deltas.accuracy = stats.accuracy - prev.accuracy;
      deltas.words = stats.words - prev.words;
      deltas.errors = errors - prevErrors;
      deltas.corrected = stats.corrected - prev.corrected;
    }
    return deltas;
  }
  static renderDirectionIcon(value) {
    switch (true) {
      case value > 0:
        return <i className="positive" />;
      case value < 0:
        return <i className="negative" />;
      default:
        return <i className="unchanged" />;
    }
  }
  static renderValue(value) {
    return value !== null ? Math.round(value) : "-";
  }
  constructor(props) {
    super(props);
    this.resetWithNewSession = this.resetWithNewSession.bind(this);
    this.bindTerminalInput = this.bindTerminalInput.bind(this);
    this.terminalInput = null;
  }
  shouldComponentUpdate(nextProps) {
    return this.props.shouldDisplay !== nextProps.shouldDisplay;
  }
  resetWithNewSession() {
    this.props.dispatch(loadNewText());
  }
  renderStatsSummary() {
    if (this.props.finalStats) {
      const finalStats = this.props.finalStats.rollingStats;
      const statsDeltas = Completed.calculateStatsDeltas(
        finalStats,
        this.props.previousStats
      );
      const errorsCurrent =
        finalStats.touched - finalStats.corrected - finalStats.correct;
      return (
        <div className="stats-summary">
          <div className="level-one">
            <div className="stats-block">
              <div className="value">{finalStats.wpm}</div>
              <div className="value-change">
                {Completed.renderDirectionIcon(statsDeltas.wpm)}
                {Completed.renderValue(statsDeltas.wpm)}
              </div>
              <div className="label">WPM</div>
            </div>
            <div className="stats-block">
              <div className="value">{Math.round(finalStats.accuracy)}%</div>
              <div className="value-change">
                {Completed.renderDirectionIcon(statsDeltas.accuracy)}
                {Completed.renderValue(statsDeltas.accuracy)}
              </div>
              <div className="label">Accuracy</div>
            </div>
            <div className="stats-block">
              <div className="value">{finalStats.words}</div>
              <div className="value-change">
                {Completed.renderDirectionIcon(statsDeltas.words)}
                {Completed.renderValue(statsDeltas.words)}
              </div>
              <div className="label">Words</div>
            </div>
            <div className="stats-block">
              <div className="value">{errorsCurrent}</div>
              <div className="value-change">
                {Completed.renderDirectionIcon(statsDeltas.errors)}
                {Completed.renderValue(statsDeltas.errors)}
              </div>
              <div className="label">Errors</div>
            </div>
            <div className="stats-block">
              <div className="value">{finalStats.corrected}</div>
              <div className="value-change">
                {Completed.renderDirectionIcon(statsDeltas.corrected)}
                {Completed.renderValue(statsDeltas.corrected)}
              </div>
              <div className="label">Corrected</div>
            </div>
          </div>
        </div>
      );
    }
    return <div className="no-stats">There are currently no stats.</div>;
  }
  renderWeakestKeysList() {
    if (
      this.props.finalStats &&
      this.props.finalStats.rollingStats.touched !==
        this.props.finalStats.rollingStats.correct
    ) {
      const errorDictionary = this.props.finalStats.rollingErrors;
      const list = [];
      const charKeys = Object.keys(errorDictionary);
      for (const char of charKeys) {
        if (errorDictionary.hasOwnProperty(char)) {
          list.push({ char, count: errorDictionary[char] });
        }
      }
      list.sort((x, y) => y.count - x.count);
      const truncatedList = list.splice(0, 5);
      return truncatedList.map(key => (
        <div className="weak-key-block" key={key.char}>
          <div className="key detail">{key.char}</div>
          <div className="divider detail">x</div>
          <div className="count detail">{key.count}</div>
        </div>
      ));
    }
    return <div className="no-weak-keys">Nice work, you made no mistakes!</div>;
  }
  renderWeakestKeys() {
    const weakestKeysList = this.renderWeakestKeysList();
    if (weakestKeysList.length > 0) {
      return (
        <div className="weakest-keys">
          <span>These are your weakest keys: </span>
          <ul>{this.renderWeakestKeysList()}</ul>
        </div>
      );
    } else {
      return (
        <div className="weakest-keys">
          <span>Well done. You made no mistakes!</span>
        </div>
      );
    }
  }
  bindTerminalInput(input) {
    this.terminalInput = input;
  }
  didTypeTerminalResponse(e) {
    if (e.key === "Enter") {
      if (this.terminalInput.value === "Yes") {
        this.resetWithNewSession();
      }
    }
  }
  componentDidUpdate() {
    this.terminalInput.focus();
  }
  render() {
    const classNames = {
      completed: true,
      displayed: this.props.shouldDisplay
    };
    return (
      <div className={classes(classNames)}>
        <h4 className="completed-header">+++ Session Completed +++</h4>
        {this.renderStatsSummary()}
        {this.renderWeakestKeys()}
        <label>Start another session? [Yes/no]</label>
        <input
          type="text"
          className="terminal-prompt"
          onKeyUp={e => {
            this.didTypeTerminalResponse(e);
          }}
          ref={input => {
            this.bindTerminalInput(input);
          }}
        />
      </div>
    );
  }
}

Completed.propTypes = {
  shouldDisplay: PropTypes.bool,
  dispatch: PropTypes.func,
  finalStats: PropTypes.object,
  previousStats: PropTypes.object
};
Completed.defaultProps = {
  shouldDisplay: false
};

export default Completed;
