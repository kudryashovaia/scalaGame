import React from "react";
import _ from "lodash";

import {SmartInput} from "./SmartInput";
import {SelectOneInput} from "./SelectOneField";
import {SmartField, SmartFieldProps} from "./SmartField";

interface SmallNumberInputProps {
  zeroText?: string;
  min?: number;
  max: number;
}

export class SmallNumberInput extends SmartInput<number, SmallNumberInputProps> {
  render(): React.ReactNode {
    let zeroItem = this.props.zeroText || "нет";
    let itemToNumber = (s: string) => (s === zeroItem) ? 0 : parseInt(s);
    let numberToItem = (n: number) => {
      if (n == 0) {
        return this.props.zeroText || "нет";
      } else {
        return String(n);
      }
    };

    let items = _.range(this.props.min || 0, this.props.max + 1).map(numberToItem);

    return (
      <SelectOneInput
        items={items}
        value={numberToItem(this.getValue())}
        onChange={v => this.onChange(itemToNumber(v))}
        className="small-buttons"
      />
    );
  }
}

export class SmallNumberField extends SmartField<number, SmallNumberInputProps> {

  renderInput(): React.ReactNode {
    return (
      <SmallNumberInput
        zeroText={this.props.zeroText}
        min={this.props.min}
        max={this.props.max}
        {...this.smartInputProps()}
      />
    );
  }


  shouldComponentUpdate(nextProps: Readonly<SmallNumberInputProps & SmartFieldProps<number>>): boolean {
    return SmartField.compareProps(this.props, nextProps) ||
      this.props.zeroText != nextProps.zeroText ||
      this.props.min != nextProps.min ||
      this.props.max != nextProps.max;
  }
}
