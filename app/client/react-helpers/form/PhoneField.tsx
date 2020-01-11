import React from "react";

import Phone from "react-phone-number-input";
import {SmartField} from "./SmartField";
import {SmartInput} from "./SmartInput";
import "react-phone-number-input/rrui.css";
import "react-phone-number-input/style.css";
import "./PhoneField.scss";

export class PhoneInput extends SmartInput<string, {}> {
  render() {
    return (
      <Phone
        country="RU"
        value={this.getValue()}
        onChange={(phone: string) => this.onChange(phone)}
      />
    )
  }
}

export class PhoneField extends SmartField<string, {}> {

  renderInput(): React.ReactNode {
    return (
      <PhoneInput
        {...this.smartInputProps()}
      />
    );
  }
}
