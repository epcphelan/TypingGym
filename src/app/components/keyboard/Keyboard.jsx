import React from 'react';
import PropTypes from 'prop-types';
import {
  charKeyPressed,
  tabPressed,
  backspacePressed,
  enterKeyPressed,
  startRecordingSession,
} from '../../actions';
import TypeAssist from './TypeAssist';
import Fingers from './Fingers';

class Keyboard extends React.Component{
  constructor(props) {
    super(props);
    this.dispatch = this.props.dispatch;
  }

  componentDidMount() {
    document.addEventListener('keydown', (e) => { this.handleKeyTyped(e); });
  }
  shouldComponentUpdate() {
    return true;
  }
  startRecording() {
    this.dispatch(startRecordingSession(new Date()));
  }
  isRecordingSession() {
    return (
      this.props.activeTest
      && this.props.testStartDate
    );
  }
  handleKeyTyped(e) {
    if (this.props.activeTest) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
    }
    if (!this.isRecordingSession() && !this.props.shouldDisplayComplete) {
      this.startRecording();
    }
    if (this.props.activeTest) {
      switch (e.key) {
        case 'Backspace' :
          this.dispatch(backspacePressed());
          break;
        case 'Tab' :
          this.dispatch(tabPressed());
          break;
        case 'Enter' :
          this.dispatch(enterKeyPressed());
          break;
        default :
          if (e.key.length === 1) {
            this.dispatch(charKeyPressed(e.key));
          }
      }
    }
  }
  calculateErrorHeatMap() {
    const currentStats = this.props.rollingStats;
    const totalErrors = currentStats.touched - currentStats.correct + currentStats.corrected;
    const errorHeatMap = Object.assign({}, this.props.rollingErrors);
    const charKeys = Object.keys(errorHeatMap);
    for (const char of charKeys) {
      if (errorHeatMap.hasOwnProperty(char)) {
        errorHeatMap[char] = Math.round((errorHeatMap[char] / totalErrors) * 100) / 100;
      }
    }
    return errorHeatMap;
  }
  mapActiveCharToArrayOfKeyChars(activeChar) {
    switch (true) {
      case (activeChar === '\n') :
        return ['enter'];
      case (activeChar === ' ') :
        return ['space'];
      case (/[A-Z~!@#$%^&*()_+}{|":?><]/.test(activeChar)) :
        switch (true) {
          case (/[QWERTASDFGZXCVB~!@#$%^]/.test(activeChar)) :
            return ['shift-r', activeChar];
          default :
            return ['shift-l', activeChar];
        }
      default :
        return [activeChar];
    }
  };
  render() {
    return (
      <div className="Keyboard">
        <TypeAssist
          activeChars={this.mapActiveCharToArrayOfKeyChars(this.props.activeChar)}
          errorHeatMap={this.calculateErrorHeatMap()}
        />
        <Fingers activeChars={this.mapActiveCharToArrayOfKeyChars(this.props.activeChar)} />
      </div>
    );
  }
}

Keyboard.propTypes = {
  dispatch: PropTypes.func,
  activeTest: PropTypes.bool,
  testStartDate: PropTypes.object,
  activeChar: PropTypes.string,
  rollingErrors: PropTypes.object,
  rollingStats: PropTypes.object,
  shouldDisplayComplete: PropTypes.bool,
};


export default Keyboard;
