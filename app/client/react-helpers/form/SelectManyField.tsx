import React from "react";
import _ from "lodash";
import {SmartInput} from "./SmartInput";
import {Button, ButtonGroup} from "react-bootstrap";
import {SmartField} from "./SmartField";

interface SelectManyInputProps<T> {
  items: T[];
  itemLabel?: (item: T) => string;
}

export class SelectManyInput<T = string> extends SmartInput<T[], SelectManyInputProps<T>> {

  static of<A>() {
    return SelectManyInput as any as new () => SelectManyInput<A>;
  }

  render() {
    let value = this.getValue() || [];
    return (
      <ButtonGroup>
        {
          this.props.items.map((item, i) =>
            <Button
              key={i}
              bsStyle={(value.includes(item)) ? "primary" : "default"}
              onClick={() => {
                if (value.includes(item)) {
                  this.onChange(_.reject(value, v => v == item));
                } else {
                  this.onChange(value.concat([item]));
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

export class SelectManyField<T = string> extends SmartField<T[], SelectManyInputProps<T>> {

  static of<A>() {
    return SelectManyField as any as new () => SelectManyField<A>;
  }

  renderInput() {
    let SelectManyInputTyped = SelectManyInput.of<T>();
    return (
      <SelectManyInputTyped
        items={this.props.items}
        itemLabel={this.props.itemLabel}
        {...this.smartInputProps()}
      />
    );
  }
}
