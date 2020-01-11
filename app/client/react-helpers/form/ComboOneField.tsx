import React from "react";
import _ from "lodash";
import Select, {ReactCreatableSelectProps, Creatable} from "react-select";

import {SmartInput, SmartInputProps} from "./SmartInput";
import {SmartField, SmartFieldProps} from "./SmartField";

interface ComboOneInputProps<T> {
  items: T[];
  itemLabel?: (item: T) => string;
  placeholder?: string;
  selectProperties?: ReactCreatableSelectProps<string>;
  allowCustom?: boolean;
}

export class ComboOneInput<T = string> extends SmartInput<T, ComboOneInputProps<T>> {

  static of<A>(props: ComboOneInputProps<A> & SmartInputProps<A>) {
    return React.createElement(
      ComboOneInput as any as new () => ComboOneInput<A>,
      props
    );
  }

  static objectIdSelector<O>(props: {id: (item: O) => number} & ComboOneInputProps<O> & SmartInputProps<number>) {
    return ComboOneInput.of<number>(
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
    let value = this.getValue();
    if (this.props.allowCustom) {
      let optionValue = value
        ? {value: value, label: this.props.itemLabel ? this.props.itemLabel(value) : String(value)} as any
        : undefined;
      return (
        <Creatable
          placeholder={this.props.placeholder || "..."}
          value={optionValue}
          options={this.props.items.map((item) => ({ value: item, label: this.props.itemLabel ? this.props.itemLabel(item) : String(item)})) as any}
          onChange={v => {
            this.onChange(v ? ((v as any).value as T) : undefined);
            this.onBlur();
          }}
          {...this.props.selectProperties}
        />
      );
    } else {
      return (
        <Select
          placeholder={this.props.placeholder || "..."}
          value={value}
          options={this.props.items.map((item) => ({ value: item, label: this.props.itemLabel ? this.props.itemLabel(item) : String(item)})) as any}
          onChange={v => {
            this.onChange(v ? ((v as any).value as T) : undefined);
            this.onBlur();
          }}
          {...this.props.selectProperties}
        />
      );
    }

  }
}

export class ComboOneField<T = string> extends SmartField<T, ComboOneInputProps<T>> {

  static of<A>(props: ComboOneInputProps<A> & SmartFieldProps<A>) {
    return React.createElement(
      ComboOneField as any as new () => ComboOneField<A>,
      props
    );
  }


  static objectIdSelector<O>(props: {id: (item: O) => number} & ComboOneInputProps<O> & SmartFieldProps<number>) {
    return ComboOneField.of<number>(
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
    return ComboOneInput.of<T>({
      items: this.props.items,
      itemLabel: this.props.itemLabel,
      placeholder: this.props.placeholder,
      selectProperties: this.props.selectProperties,
      allowCustom: this.props.allowCustom,
      ...this.smartInputProps()
    });
  }

  shouldComponentUpdate(nextProps: Readonly<ComboOneInputProps<T> & SmartFieldProps<T>>): boolean {
    return SmartField.compareProps(this.props, nextProps) ||
      !_.isEqual(this.props.items, nextProps.items) ||
      this.props.placeholder != nextProps.placeholder ||
      !_.isEqual(this.props.selectProperties, nextProps.selectProperties);
  }

}
