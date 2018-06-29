import React, { Component } from "react";
import PropTypes from "prop-types";
import { classes } from "../common/utils";

class TypeAssistKey extends Component {
  static isActive(activeChars, lowChar, shiftChar) {
    return (
      activeChars.indexOf(lowChar) > -1 || activeChars.indexOf(shiftChar) > -1
    );
  }
  shouldComponentUpdate(nextProps) {
    return (
      TypeAssistKey.isActive(
        this.props.activeChars,
        this.props.lowChar,
        this.props.shiftChar
      ) !==
        TypeAssistKey.isActive(
          nextProps.activeChars,
          nextProps.lowChar,
          nextProps.shiftChar
        ) || this.props.errorHeatMapScore !== nextProps.errorHeatMapScore
    );
  }
  render() {
    const isActive = TypeAssistKey.isActive(
      this.props.activeChars,
      this.props.lowChar,
      this.props.shiftChar
    );
    const isUpperLowerPair =
      this.props.lowChar.toLowerCase() === this.props.shiftChar.toLowerCase();
    const keyClasses = {
      "type-key": true,
      isActive,
      "upper-lower-case-pair": isUpperLowerPair
    };
    keyClasses[this.props.keySize] = true;
    const classNames = classes(keyClasses);
    const styles = {
      backgroundColor: `rgba(255,0,0,${Math.min(
        this.props.errorHeatMapScore,
        0.5
      )})`
    };
    let keyContents = [
      <div key="upper-char" className="shift-char">
        {" "}
        {this.props.shiftChar}{" "}
      </div>
    ];
    if (!isUpperLowerPair) {
      keyContents.push(
        <div key="lower-char" className="low-char">
          {" "}
          {this.props.lowChar}{" "}
        </div>
      );
    }
    return (
      <div style={styles} className={classNames}>
        {keyContents}
      </div>
    );
  }
}

TypeAssistKey.propTypes = {
  activeChars: PropTypes.array,
  lowChar: PropTypes.string,
  shiftChar: PropTypes.string,
  keySize: PropTypes.string,
  errorHeatMapScore: PropTypes.number
};

export default TypeAssistKey;
