import React from "react";
import {SmartInput, SmartInputProps} from "./SmartInput";
import {Checkbox} from "react-bootstrap";
import {SmartField, SmartFieldProps} from "./SmartField";
import "./CheckboxField.scss";

interface CheckboxInputProps {
  children?: React.ReactNode;
  unstyled?: boolean;
}

export class CheckboxInput extends SmartInput<boolean, CheckboxInputProps> {
  render() {
    return (
      <Checkbox
        className={!this.props.unstyled && "styled-checkbox"}
        checked={this.getValue() === true}
        onChange={(e) => this.onChange((e.target as HTMLInputElement).checked)}
      >{this.props.children}</Checkbox>
    );
  }

  shouldComponentUpdate(nextProps: Readonly<CheckboxInputProps & SmartInputProps<boolean>>): boolean {
    return SmartInput.compareProps(this.props, nextProps) ||
      this.props.children != nextProps.children ||
      this.props.unstyled != nextProps.unstyled;
  }
}

export class CheckboxField extends SmartField<boolean, CheckboxInputProps> {
  renderInput() {
    return (
      <CheckboxInput
        children={this.props.children}
        unstyled={this.props.unstyled}
        {...this.smartInputProps()}
      />
    );
  }

  shouldComponentUpdate(nextProps: Readonly<CheckboxInputProps & SmartFieldProps<boolean>>): boolean {
    return SmartField.compareProps(this.props, nextProps) ||
      this.props.children != nextProps.children ||
      this.props.unstyled != nextProps.unstyled;
  }

}
