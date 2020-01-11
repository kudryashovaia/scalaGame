import React from "react";

import MaskedInput from "react-maskedinput";
import InputMask from "inputmask-core";
import {SmartInput, SmartInputProps} from "./SmartInput";
import {SmartField} from "./SmartField";

export interface MaskedStringInputProps {
  mask: string;
}

export class MaskedStringInput extends React.Component<MaskedStringInputProps & SmartInputProps<string>> {

  static getMaskedValue(pattern: string, value: string): string {
    let mask = new InputMask({pattern: pattern, value: value});
    return mask.getValue();
  }

  static isFullMatch(pattern: string, value: string): boolean {
    let mask = new InputMask({ pattern: pattern, value: value });
    let rawValue = mask.getRawValue();
    return !rawValue.match(/_/);
  }

  render() {
    return (
      <MaskedStringInputInner
        hasErrors={v =>
          ((!!v && !MaskedStringInput.isFullMatch(this.props.mask, v)) && "Поле заполнено неверно") ||
          (this.props.hasErrors ? this.props.hasErrors(v) : false)
        }
        {...this.props}
      />
    );
  }

}

class MaskedStringInputInner extends SmartInput<string, MaskedStringInputProps> {
  handleChange(e: any) {
    let value = (e.target as HTMLInputElement).value;
    let mask = new InputMask({ pattern: this.props.mask, value: value });
    let rawValue = mask.getRawValue().replace(/_/g, "");
    this.onChange(rawValue);
  }

  render() {
    return (
      <MaskedInput
        mask={this.props.mask}
        value={this.getValue()}
        onBlur={() => this.onBlur()}
        onChange={(e) => this.handleChange(e)}
        className="form-control" />
    );
  }
}

export class MaskedStringField extends SmartField<string, MaskedStringInputProps> {

  renderInput(): React.ReactNode {
    return (
      <MaskedStringInput
        mask={this.props.mask}
        {...this.smartInputProps()}
      />
    );
  }

}
