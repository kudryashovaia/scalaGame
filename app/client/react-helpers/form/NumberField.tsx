import React from "react";
import {FormControl} from "react-bootstrap";
import _ from "lodash";
import {SmartInput, SmartInputProps} from "./SmartInput";
import {SmartField, SmartFieldProps} from "./SmartField";

interface NumberInputProps {
  style?: React.CSSProperties,
  placeholder?: string;
  integer?: boolean;
  min?: number;
  max?: number;
  decimalPlaces?: number;
  disabled?: boolean;
}

export class NumberInput extends SmartInput<number, NumberInputProps> {

  handleChange(e: any) {
    let s = (e.target as HTMLInputElement).value;
    if (s) {
      s = s.replace(",", ".");
    }
    let v: number;
    if (this.props.integer) {
      v = parseInt(s);
    } else {
      v = parseFloat(s);
    }
    if (this.props.max && v > this.props.max) {
      v = this.props.max;
    }
    if (this.props.min && v < this.props.min) {
      v = this.props.min;
    }
    if (this.props.decimalPlaces) {
      v = parseFloat(v.toFixed(this.props.decimalPlaces));
    }
    if (!isNaN(v)) {
      this.onChange(v);
    } else if (s.trim() === "") {
      this.onChange(undefined);
    }
  }

  render() {
    let value = this.getValue();
    return (
      <FormControl
        type="number"
        value={(value === null || value === undefined) ? "" : value}
        min={this.props.min}
        max={this.props.max}
        onChange={(e) => this.handleChange(e)}
        onBlur={() => this.onBlur()}
        placeholder={this.props.placeholder}
        style={_.assign({width: "120px", display: "inline-block", textAlign: "right"}, this.props.style)}
        disabled={this.props.disabled}
      />
    );
  }

  shouldComponentUpdate(nextProps: Readonly<NumberInputProps & SmartInputProps<number>>): boolean {
    return SmartInput.compareProps(this.props, nextProps) ||
      !_.isEqual(this.props.style, nextProps.style) ||
      this.props.placeholder != nextProps.placeholder ||
      this.props.integer != nextProps.integer ||
      this.props.min != nextProps.min ||
      this.props.max != nextProps.max ||
      this.props.decimalPlaces != nextProps.decimalPlaces ||
      this.props.disabled != nextProps.disabled;
  }
}

export class NumberField extends SmartField<number, NumberInputProps & {postfix?: React.ReactNode}> {

  renderInput() {
    return (
      <div>
        <NumberInput
          style={this.props.style}
          placeholder={this.props.placeholder}
          integer={this.props.integer}
          min={this.props.min}
          max={this.props.max}
          decimalPlaces={this.props.decimalPlaces}
          disabled={this.props.disabled}
          {...this.smartInputProps()}
        />
        {' '}
        {this.props.postfix}
      </div>
    );
  }

  shouldComponentUpdate(nextProps: Readonly<NumberInputProps & { postfix?: React.ReactNode } & SmartFieldProps<number>>): boolean {
    return SmartField.compareProps(this.props, nextProps) ||
      !_.isEqual(this.props.style, nextProps.style) ||
      this.props.placeholder != nextProps.placeholder ||
      this.props.integer != nextProps.integer ||
      this.props.min != nextProps.min ||
      this.props.max != nextProps.max ||
      this.props.decimalPlaces != nextProps.decimalPlaces ||
      this.props.disabled != nextProps.disabled;
  }

}
