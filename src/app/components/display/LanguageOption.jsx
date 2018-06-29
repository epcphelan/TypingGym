import React from "react";
import PropTypes from "prop-types";

class LanguageOption extends React.Component {
  constructor(props) {
    super(props);
    this.handleOnCLick = this.handleOnCLick.bind(this);
  }
  handleOnCLick() {
    this.props.changeTextType(this.props.textType);
  }
  render() {
    const classes = `${this.props.active ? "active" : ""} switch-language`;
    return (
      <div className={classes} onClick={this.handleOnCLick}>
        {" "}
        {this.props.label}{" "}
      </div>
    );
  }
}

LanguageOption.propTypes = {
  changeTextType: PropTypes.func,
  textType: PropTypes.string,
  label: PropTypes.string,
  active: PropTypes.bool
};

export default LanguageOption;
