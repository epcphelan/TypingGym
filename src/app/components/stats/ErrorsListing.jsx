import React, { Component } from 'react';
import PropTypes from 'prop-types';

class ErrorsListing extends Component {
  shouldComponentUpdate(nextProps) {
    return this.props.rollingErrors !== nextProps.rollingErrors;
  }
  listErrors() {
    const errorDictionary = this.props.rollingErrors;
    const list = [];
    const charKeys = Object.keys(errorDictionary);
    for (const char of charKeys) {
      if (errorDictionary.hasOwnProperty(char)) {
        list.push({ char, count: errorDictionary[char] });
      }
    }
    return list.sort((x, y) => y.count - x.count);
  }
  render() {
    return (
      <ul>
        {this.listErrors()
          .map(item => (<li key={`char-${item.char}`}> {item.char} : {item.count} </li>))}
      </ul>
    );
  }
}

ErrorsListing.propTypes = {
  rollingErrors: PropTypes.object,
};
ErrorsListing.defaultProps = {};

export default ErrorsListing;
