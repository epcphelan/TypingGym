import React, { Component } from 'react';
import PropTypes from 'prop-types';

class StringCharacter extends Component {
  shouldComponentUpdate(nextProps) {
    const { index, currentPosition, item } = this.props;
    return index === currentPosition || index === nextProps.currentPosition
      || item !== nextProps.item;
  }
  render() {
    const { index, item, currentPosition, bindActiveCharSpan } = this.props;
    const touchedClass = item.touched === true ? 'touched ' : '';
    const incorrectClass = item.correct === false ? 'incorrect ' : '';
    const currentChar = index === currentPosition ? 'current-char ' : '';
    const isSpace = item.char === ' ' ? 'is-space ' : '';
    const classes = `${touchedClass}${incorrectClass}${currentChar}${isSpace}`;
    if (index === currentPosition) {
      return (
        <span
          ref={(span) => { bindActiveCharSpan(span); }}
          className={classes}
        >{item.char}</span>
      );
    }
    return (
      <span className={classes}>{item.char}</span>
    );
  }
}

StringCharacter.propTypes = {
  index: PropTypes.number,
  item: PropTypes.object,
  currentPosition: PropTypes.number,
  bindActiveCharSpan: PropTypes.func,
};
StringCharacter.defaultProps = {};

export default StringCharacter;
