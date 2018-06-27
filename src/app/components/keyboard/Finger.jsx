import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Finger extends Component {
  shouldComponentUpdate(nextProps) {
    return this.props.isActive !== nextProps.isActive;
  }
  render() {
    const { index, isActive } = this.props;
    return (
      <div
        className={`finger finger-${index} ${isActive ? 'active' : ''}`}
      />
    );
  }
}

Finger.propTypes = {
  index: PropTypes.number,
  isActive: PropTypes.bool,
};
Finger.defaultProps = {};

export default Finger;
