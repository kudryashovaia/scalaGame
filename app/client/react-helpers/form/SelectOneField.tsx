import React from "react";
import _ from "lodash";

import {SmartInput} from "./SmartInput";
import {ButtonGroup, Button} from "react-bootstrap";
import {SmartField, SmartFieldProps} from "./SmartField";

interface SelectOneInputProps<T> {
  items: T[];
  itemLabel?: (item: T) => React.ReactNode;
  allowDeselect?: boolean;
  className?: string;
}

export class SelectOneInput<T = string> extends SmartInput<T, SelectOneInputProps<T>> {

  static of<A>() {
    return SelectOneInput as any as new () => SelectOneInput<A>;
  }

  render() {
    let value = this.getValue();
    return (
      <ButtonGroup className={this.props.className}>
        {
          this.props.items.map((item, i) =>
            <Button
              key={i}
              bsSize="sm"
              bsStyle={value == item ? "primary" : "default"}
              onClick={() => {
                if (this.getValue() === item && this.props.allowDeselect) {
                  this.onChange(undefined);
                } else {
                  this.onChange(item);
                }
              }}
            >
              {this.props.itemLabel ? this.props.itemLabel(item) : String(item)}
              </Button>
          )
        }
      </ButtonGroup>
    );
  }

}

export class SelectOneField<T = string> extends SmartField<T, SelectOneInputProps<T>> {

  static of<A>() {
    return SelectOneField as any as new () => SelectOneField<A>;
  }


  renderInput(): React.ReactNode {
    let SelectOneInputTyped = SelectOneInput.of<T>();
    return (
      <SelectOneInputTyped
        items={this.props.items}
        itemLabel={this.props.itemLabel}
        allowDeselect={this.props.allowDeselect}
        className={this.props.className}
        {...this.smartInputProps()}
      />
    );
  }

  shouldComponentUpdate(nextProps: Readonly<SelectOneInputProps<T> & SmartFieldProps<T>>): boolean {
    return SmartField.compareProps(this.props, nextProps) ||
      !_.isEqual(this.props.items, nextProps.items) ||
      this.props.allowDeselect != nextProps.allowDeselect ||
      this.props.className != nextProps.className;
  }
}
