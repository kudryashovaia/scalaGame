import React from "react";
import _ from "lodash";
import Select, {ReactSelectProps} from "react-select";

import {SmartInput, SmartInputProps} from "./SmartInput";
import {SmartField, SmartFieldProps} from "./SmartField";

interface ComboManyInputProps<T> {
  items: T[];
  itemLabel?: (item: T) => string;
  placeholder?: string;
  selectProperties?: ReactSelectProps<string>;
}

export class ComboManyInput<T = string> extends SmartInput<T[], ComboManyInputProps<T>> {

  static of<A>(props: ComboManyInputProps<A> & SmartInputProps<A[]>) {
    return React.createElement(
      ComboManyInput as any as new () => ComboManyInput<A>,
      props
    );
  }

  static objectIdSelector<O>(props: {id: (item: O) => number} & ComboManyInputProps<O> & SmartInputProps<number[]>) {
    return ComboManyInput.of<number>(
      _.assign(
        {},
        props,
        {
          items: props.items.map(props.id),
          itemLabel: (itemId: number) => props.itemLabel(_.find(props.items, item => props.id(item) === itemId)),
        }
      )
    );
  }

  render() {
    let value = this.getValue() || [];
    return (
      <Select
        multi={true}
        value={value}
        options={this.props.items.map((item) => ({ value: item, label: this.props.itemLabel ? this.props.itemLabel(item) : String(item)})) as any}
        onChange={(v: any) => {
          this.onChange(v ? v.map((v: any) => v.value as T) : []);
          this.onBlur();
        }}
        placeholder={this.props.placeholder}
        {...this.props.selectProperties}
      />
    );
  }

}

export class ComboManyField<T = string> extends SmartField<T[], ComboManyInputProps<T>> {

  static of<A>(props: ComboManyInputProps<A> & SmartFieldProps<A[]>) {
    return React.createElement(
      ComboManyField as any as new () => ComboManyField<A>,
      props
    );
  }

  static objectIdSelector<O>(props: {id: (item: O) => number} & ComboManyInputProps<O> & SmartFieldProps<number[]>) {
    return ComboManyField.of<number>(
      _.assign(
        {},
        props,
        {
          items: props.items.map(props.id),
          itemLabel: (itemId: number) => props.itemLabel(_.find(props.items, item => props.id(item) === itemId)),
        }
      )
    );
  }

  renderInput() {
    return ComboManyInput.of<T>({
      items: this.props.items,
      itemLabel: this.props.itemLabel,
      placeholder: this.props.placeholder,
      selectProperties: this.props.selectProperties,
      ...this.smartInputProps()
    });
  }


  shouldComponentUpdate(nextProps: Readonly<ComboManyInputProps<T> & SmartFieldProps<T[]>>): boolean {
    return SmartField.compareProps(this.props, nextProps) ||
      !_.isEqual(this.props.items, nextProps.items) ||
      this.props.placeholder != nextProps.placeholder ||
      !_.isEqual(this.props.selectProperties, nextProps.selectProperties);
  }
}
