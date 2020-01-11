import _ from "lodash";

import {Bind} from "./Bind";

export class ValueBind<T> implements Bind<T> {

  parent?: Bind<any>;
  keys: any[];
  value: T;
  defaultValue: T;

  private underlyingValue?: T;
  private underlyingOnChange?: (value: T) => void;

  private constructor(
    underlyingValue: T,
    underlyingOnChange: (value: T) => void,
    keys: any[],
    value: T,
    defaultValue: T,
    parent: Bind<any>
  ) {
    this.underlyingValue = underlyingValue;
    this.underlyingOnChange = underlyingOnChange;

    this.keys = keys;
    this.value = value;
    this.defaultValue = defaultValue;
    this.parent = parent;
  }

  static create<T>(value: T, onChange: (value: T) => void): ValueBind<T> {
    return new ValueBind<T>(
      value,
      onChange,
      [],
      value,
      null,
      null
    );
  }

  get<K extends keyof T>(key: K): ValueBind<T[K]> {
    return new ValueBind<T[K]>(
      null,
      null,
      this.keys.concat([key]),
      this.value ? this.value[key] : undefined,
      null,
      this as Bind<any>
    );
  }

  getValue(): T {
    return this.value;
  }

  setValue(newValue: T) {
    this.applyChange(() => newValue);
  }

  applyChange(change: (value: T) => T) {
    if (this.keys.length === 0) {
      this.underlyingOnChange(change(this.underlyingValue));
    } else {
      this.parent.applyChange((value: any) => {
        let parentValue = _.cloneDeep(value);
        let key = _.last(this.keys);
        if (parentValue) {
          let value = parentValue[key];
          if (value === undefined && this.defaultValue) {
            value = this.defaultValue;
          }
          parentValue[key] = change(value);
        }
        return parentValue;
      });
    }
  }

  withDefaultValue(defaultValue: T): ValueBind<T> {
    return new ValueBind<T>(
      this.underlyingValue,
      this.underlyingOnChange,
      this.keys,
      this.value,
      defaultValue,
      this.parent
    );
  }

  isEqual(other: ValueBind<T>): boolean {
    return _.isEqual(this.keys, other.keys) && _.isEqual(this.value, other.value);
  }

}
