import React from "react";
import _ from "lodash";
import {Bind} from "./Bind";

export class StateBind<T> implements Bind<T> {

  parent?: Bind<any>;
  keys: any[];
  value: T;
  defaultValue: T;

  component: React.Component<any, any>;

  private constructor(
    component: React.Component<any, any>,
    keys: any[],
    value: T,
    defaultValue: T,
    parent: Bind<any>
  ) {
    this.component = component;
    this.keys = keys;
    this.value = value;
    this.defaultValue = defaultValue;
    this.parent = parent;
  }

  static of<A>(component: React.Component<any, A>): Bind<A> {
    return new StateBind<A>(component, [], component.state, null, null);
  }

  get<K extends keyof T>(key: K): Bind<T[K]> {
    return new StateBind<T[K]>(
      this.component,
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
    if (this.keys.length == 0) {
      this.component.setState((prevState: any) => {
        let state = _.cloneDeep(prevState);
        if (state === undefined && this.defaultValue) {
          state = this.defaultValue;
        }
        state = change(state);
        return state;
      })
    } else if (this.keys.length == 1) {
      this.component.setState((prevState: any) => {
        let key = this.keys[0];
        let value = _.cloneDeep(prevState && prevState[key]);
        if (value === undefined && this.defaultValue) {
          value = this.defaultValue;
        }
        value = change(value);
        return _.fromPairs([[key, value]]);
      });
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

  withDefaultValue(defaultValue: T): StateBind<T> {
    return new StateBind<T>(
      this.component,
      this.keys,
      this.value,
      defaultValue,
      this.parent
    );
  }

  isEqual(other: StateBind<T>): boolean {
    return _.isEqual(this.keys, other.keys) && _.isEqual(this.value, other.value);
  }

}

