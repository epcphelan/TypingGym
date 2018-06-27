import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Keyboard from './keyboard/Keyboard';
import Display from './display/Display';
import Leaderboard from './stats/Leaderboard';
import TimeSeries from './stats/TimeSeries';

import { showComplete, addToHistory } from '../actions';

class App extends Component {
  constructor(props) {
    super(props);
    this.store = this.props.store;
  }
  componentWillReceiveProps(nextProps) {
    const stringDisplay = nextProps.store.getState().stringDisplay;
    if (stringDisplay.currentPosition > 0 &&
      stringDisplay.currentPosition >= (stringDisplay.stringMap.length)
      && stringDisplay.shouldDisplayComplete === false) {
      this.store.dispatch(addToHistory());
      this.store.dispatch(showComplete());
    }
  }
  render() {
    const store = this.store;
    const stringDisplay = store.getState().stringDisplay;
    const activeChar = stringDisplay.stringMap.length > stringDisplay.currentPosition
      ? stringDisplay.stringMap[stringDisplay.currentPosition].char : '';

    return (
      <div className="container">
        <Leaderboard rollingStats={stringDisplay.rollingStats} />
        <Display
          dispatch={store.dispatch}
          stringMap={stringDisplay.stringMap}
          currentPosition={stringDisplay.currentPosition}
          textType={stringDisplay.textType}
          shouldDisplayComplete={stringDisplay.shouldDisplayComplete}
          sessionHistories={stringDisplay.sessionHistories}
        />
        <TimeSeries
          dispatch={store.dispatch}
          snapshots={stringDisplay.snapshots}
          activeTest={stringDisplay.activeTest}
          rollingStats={stringDisplay.rollingStats}
          currentPosition={stringDisplay.currentPosition}
          stringMap={stringDisplay.stringMap}
          shouldDisplayComplete={stringDisplay.shouldDisplayComplete}
        />
        <Keyboard
          dispatch={store.dispatch}
          activeChar={activeChar}
          activeTest={stringDisplay.activeTest}
          testStartDate={stringDisplay.testStartDate}
          rollingErrors={stringDisplay.rollingErrors}
          rollingStats={stringDisplay.rollingStats}
          shouldDisplayComplete={stringDisplay.shouldDisplayComplete}
        />

      </div>
    );
  }
}

App.propTypes = { store: PropTypes.object };

export default App;

