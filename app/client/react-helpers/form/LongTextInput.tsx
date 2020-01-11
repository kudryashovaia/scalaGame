import React from "react";
import {FormControl} from "react-bootstrap";

import {SmartInput} from "./SmartInput";
import {SmartField, SmartFieldProps} from "./SmartField";

interface LongTextInputProps {
  rows?: number;
  disabled?: boolean;
}

export class LongTextInput extends SmartInput<string, LongTextInputProps> {

  normalizeValue(t: string): string {
    return t || "";
  }

  render(): React.ReactNode {
    return (
      <FormControl
        value={this.getValue()}
        onChange={(e) => this.onChange((e.target as HTMLTextAreaElement).value)}
        onBlur={() => this.onBlur()}
        disabled={this.props.disabled}
        rows={this.props.rows || 4}
        componentClass="textarea"
      />
    );
  }

  shouldComponentUpdate(nextProps: Readonly<LongTextInputProps & SmartFieldProps<string>>): boolean {
    return SmartInput.compareProps(this.props, nextProps) ||
      this.props.rows != nextProps.rows ||
      this.props.disabled != nextProps.disabled;
  }

}

export class LongTextField extends SmartField<string, LongTextInputProps> {

  renderInput(): React.ReactNode {
    return (
      <LongTextInput
        disabled={this.props.disabled}
        rows={this.props.rows}
        {...this.smartInputProps()}
      />
    );
  }

  shouldComponentUpdate(nextProps: Readonly<LongTextInputProps & SmartFieldProps<string>>): boolean {
    return SmartField.compareProps(this.props, nextProps) ||
      this.props.rows != nextProps.rows ||
      this.props.disabled != nextProps.disabled;
  }

}
