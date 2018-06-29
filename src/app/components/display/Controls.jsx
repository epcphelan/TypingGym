import React, { Component } from "react";
import PropTypes from "prop-types";
import LanguageOption from "./LanguageOption";

class Controls extends Component {
  constructor(props) {
    super(props);
    this.handleOnCLick = this.handleOnCLick.bind(this);
  }
  getLanguageOptions() {
    const options = [
      {
        label: "JS",
        textType: "js",
        active: this.props.currentLanguage === "js"
      },
      {
        label: "HTML",
        textType: "html",
        active: this.props.currentLanguage === "html"
      },
      {
        label: "Prose",
        textType: "prose",
        active: this.props.currentLanguage === "prose"
      },
      {
        label: "Swift",
        textType: "swift",
        active: this.props.currentLanguage === "swift"
      }
    ];
    return options.map(option => (
      <LanguageOption
        label={option.label}
        textType={option.textType}
        changeTextType={this.handleOnCLick}
        active={option.active}
        key={option.textType}
      />
    ));
  }
  handleOnCLick(textType) {
    this.props.changeTextType(textType);
  }
  render() {
    return (
      <div>
        <div className="controls">{this.getLanguageOptions()}</div>
      </div>
    );
  }
}

Controls.propTypes = {
  changeTextType: PropTypes.func.isRequired,
  currentLanguage: PropTypes.string
};
Controls.defaultProps = {};

export default Controls;
