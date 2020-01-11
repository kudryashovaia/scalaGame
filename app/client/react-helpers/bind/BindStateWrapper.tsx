import React from "react";
import {Bind} from "./Bind";
import {StateBind} from "./StateBind";

interface BindStateWrapperProps<T> {
  initValue: T;
  children: (bind: Bind<T>) => React.ReactNode
}

interface BindStateWrapperState<T> {
  value: T;
}

export class BindStateWrapper<T = any> extends React.Component<BindStateWrapperProps<T>, BindStateWrapperState<T>> {
  constructor(props: BindStateWrapperProps<T>) {
    super(props);
    this.state = {
      value: props.initValue
    };
  }

  static of<A>(props: BindStateWrapperProps<A>) {
    return React.createElement(
      BindStateWrapper as any as new () => BindStateWrapper<A>,
      props
    );
  }

  render(): React.ReactNode {
    let result = this.props.children(StateBind.of(this).get("value"));
    return (result === undefined) ? null : result;
  }
}
