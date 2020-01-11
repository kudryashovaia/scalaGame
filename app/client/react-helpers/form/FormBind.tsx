import React from "react";
import _ from "lodash";

import {SmartForm, SmartInputError} from "./SmartForm";
import {Bind} from "../bind/Bind";

export class FormBind<T> implements Bind<T> {

  parent?: FormBind<any>;
  keys: any[];
  value: T;
  defaultValue: T;

  private underlying?: Bind<T>;
  private form: SmartForm<any>;
  private prop: string;
  private error: SmartInputError;

  private constructor(
    keys: any[],
    value: T,
    defaultValue: T,
    underlying: Bind<T>,
    parent: FormBind<any>,
    form: SmartForm<any>
  ) {
    this.keys = keys;
    this.value = value;
    this.defaultValue = defaultValue;
    this.underlying = underlying;
    this.parent = parent;

    this.form = form;
    this.prop = this.keys.join(".");
    this.error = this.form.getError(this.prop);
  }

  static wrap<A>(bind: Bind<A>, form: SmartForm<A>): FormBind<A> {
    return new FormBind<A>(
      bind.keys,
      bind.value,
      bind.defaultValue,
      bind,
      null,
      form
    );
  }

  get<K extends keyof T>(key: K): FormBind<T[K]> {
    return new FormBind<T[K]>(
      this.keys.concat([key]),
      this.value ? this.value[key] : undefined,
      null,
      null,
      this as FormBind<any>,
      this.form
    );
  }

  getValue(): T {
    return this.value;
  }

  setValue(newValue: T) {
    this.applyChange(() => newValue);
  }

  applyChange(change: (value: T) => T) {
    if (this.parent) {
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
    } else {
      this.underlying.applyChange(change);
    }
  }

  withDefaultValue(defaultValue: T): FormBind<T> {
    return new FormBind<T>(
      this.keys,
      this.value,
      defaultValue,
      this.underlying,
      this.parent,
      this.form
    );
  }

  getError(): SmartInputError {
    return this.form.getError(this.prop);
  }

  getErrorMessage(): string {
    let error = this.form.getError(this.prop);
    return error && !error.fresh && error.message;
  }

  setError(message: string, fresh: boolean) {
    this.form.updateError(this.prop, message, fresh);
  }

  inputRemoved() {
    this.form.updateError(this.prop, undefined, false);
  }

  isFormVertical() {
    return this.form.props.vertical;
  }

  isEqual(other: FormBind<T>): boolean {
    return _.isEqual(this.keys, other.keys) && _.isEqual(this.value, other.value) && _.isEqual(this.error, other.error);
  }
}
