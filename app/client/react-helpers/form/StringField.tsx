import React from "react";
import {FormControl} from "react-bootstrap";

import {SmartField, SmartFieldProps} from "./SmartField";
import {SmartInput} from "./SmartInput";

interface StringInputProps {
  placeholder?: string;
  type?: "text" | "password";
  autoFocus?: boolean;
  disabled?: boolean;
}

export class StringInput extends SmartInput<string, StringInputProps> {
  render() {
    return (
      <FormControl
        type={this.props.type || "text"}
        value={this.getValue() || ""}
        onChange={(e) => this.onChange((e.target as HTMLInputElement).value || undefined)}
        onBlur={() => this.onBlur()}
        placeholder={this.props.placeholder}
        autoFocus={this.props.autoFocus}
        disabled={this.props.disabled}
      />
    );
  }
}

export class StringField extends SmartField<string, StringInputProps> {

  renderInput() {
    return (
      <StringInput
        placeholder={this.props.placeholder}
        {...this.smartInputProps()}
      />
    );
  }

  shouldComponentUpdate(nextProps: Readonly<StringInputProps & SmartFieldProps<string>>): boolean {
    return SmartField.compareProps(this.props, nextProps) ||
      this.props.placeholder != nextProps.placeholder ||
      this.props.type != nextProps.type ||
      this.props.autoFocus != nextProps.autoFocus ||
      this.props.disabled != nextProps.disabled;
  }

  static checkMaxLength(v: string, length: number): string {
    return v && v.length > length && `Максимальная длина: ${length} символов`;
  }

}

