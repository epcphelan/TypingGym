import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { loadNewText, changeTextType } from '../../actions';
import StringCharacter from './StringCharacter';
import Completed from './Completed';
import Controls from './Controls';

class Display extends Component {
  constructor(props) {
    super(props);
    this.dispatch = props.dispatch;
    this.styles = {
      whiteSpace: 'pre-wrap',
    };
    this.updateTextType = this.updateTextType.bind(this);
    this.bindActiveCharSpan = this.bindActiveCharSpan.bind(this);
    this.bindTextPanel = this.bindTextPanel.bind(this);
  }
  componentDidMount() {
    this.dispatch(loadNewText());
  }
  shouldComponentUpdate(nextProps) {
    return this.props.stringMap !== nextProps.stringMap;
  }
  componentDidUpdate() {
    if (this.activeCharSpan){
      const halfway = this.textPanel.offsetHeight / 2;
      this.textPanel.scrollTop = Math.max(this.activeCharSpan.offsetTop - halfway, 0);
    }
  }
  getCurrentLanguage() {
    return this.props.textType;
  }
  bindActiveCharSpan(span) {
    this.activeCharSpan = span;
  }
  bindTextPanel(panel) {
    this.textPanel = panel;
  }
  displayCurrentString() {
    if (this.props.stringMap) {
      const currentPosition = this.props.currentPosition;
      return this.props.stringMap.map((item, index) => {
        return (<StringCharacter
          key={index}
          currentPosition={currentPosition}
          index={index}
          item={item}
          bindActiveCharSpan={this.bindActiveCharSpan}
        />);
      });
    }
    return 'Nothing Typed';
  }
  updateTextType(textType) {
    this.dispatch(changeTextType(textType));
    this.dispatch(loadNewText());
  }
  render() {
    const sessionHistories = this.props.sessionHistories;
    const prevStats = sessionHistories.length > 1 ?
      sessionHistories[sessionHistories.length - 2] : null;
    return (
      <div className="type-display" style={this.styles}>
        <Controls
          changeTextType={this.updateTextType}
          currentLanguage={this.getCurrentLanguage()}
        />
        <div ref={(div) => { this.bindTextPanel(div); }} className="text-panel">
          <div className="annotated-string">
            {this.displayCurrentString()}
          </div>
          <Completed
            shouldDisplay={this.props.shouldDisplayComplete}
            dispatch={this.props.dispatch}
            finalStats={sessionHistories[sessionHistories.length - 1]}
            previousStats={prevStats}
          />
        </div>
      </div>
    );
  }
}

Display.propTypes = {
  dispatch: PropTypes.func,
  stringMap: PropTypes.array,
  currentPosition: PropTypes.number,
  textType: PropTypes.string,
  completed: PropTypes.element,
  shouldDisplayComplete: PropTypes.bool,
  sessionHistories: PropTypes.array,
};

Display.defaultProps = {};

export default Display;
