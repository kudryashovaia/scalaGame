import React from "react";

export interface Bind<T> {
  keys: any[];
  value: T;

  defaultValue: T;
  withDefaultValue(defaultValue: T): Bind<T>;

  get<K extends keyof T>(key: K): Bind<T[K]>;
  getValue(): T;
  setValue(newValue: T): void;
  applyChange(change: (value: T) => T): void;
  isEqual(other: Bind<T>): boolean;
}

