import React from "react";
import _ from "lodash";
import {FormBind} from "./FormBind";

export interface SmartInputProps<T> {
  value?: T;
  onChange?: (v: T) => void;
  bind?: FormBind<T>;
  hasErrors?: (value: T) => boolean | string;
  required?: boolean;
}

export abstract class SmartInput<T, P, S = {}> extends React.Component<P & SmartInputProps<T>, S> {
  constructor(props: P & SmartInputProps<T>) {
    super(props);
  }

  getValue(): T {
    if (this.props.bind) {
      return this.props.bind.getValue();
    } else {
      return this.props.value;
    }
  }

  protected fresh: boolean = true;

  validate(value: T) {
    let requiredMissing = (this.props.required && value === undefined) && "Поле должно быть заполнено";
    let hasErrors = requiredMissing || (this.props.hasErrors && this.props.hasErrors(value));
    let message = undefined;
    if (_.isString(hasErrors)) {
      message = hasErrors;
    } else if (hasErrors === true) {
      message = "Ошибка!"
    }
    if (this.props.bind) {
      this.props.bind.setError(message, this.fresh);
    }
  }

  onBlur(): void {
    this.fresh = false;
    this.validate(this.getValue());
  }

  componentDidMount() {
    let value = this.getValue();
    this.fresh = !value;
    this.validate(value);
  }

  componentWillUnmount() {
    if (this.props.bind) {
      this.props.bind.inputRemoved();
    }
  }

  componentWillReceiveProps(nextProps: Readonly<P & SmartInputProps<T>>): void {
    if (this.props.bind && nextProps.bind) {
      if (this.props.bind.getValue() != nextProps.bind.getValue()) {
        this.validate(nextProps.bind.getValue());
      }
    }
  }

  onChange(value: T) {
    if (this.props.onChange) {
      this.props.onChange(value);
    }
    if (this.props.bind) {
      this.props.bind.setValue(value);
    }
  }

  abstract render(): React.ReactNode;

  static compareProps<T>(props: SmartInputProps<T>, nextProps: SmartInputProps<T>): boolean {
    return !(props.bind ? props.bind.isEqual(nextProps.bind) : nextProps.bind != props.bind) ||
      props.value != nextProps.value ||
      props.onChange != nextProps.onChange ||
      props.required != nextProps.required;
  }
}
