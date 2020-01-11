import React from "react";

interface StateWrapperProps<T> {
  initValue: T;
  children: (value: T, setValue: (value: T) => void) => React.ReactNode
}

interface StateWrapperState<T> {
  value: T;
}

export class StateWrapper<T = any> extends React.Component<StateWrapperProps<T>, StateWrapperState<T>> {
  constructor(props: StateWrapperProps<T>) {
    super(props);
    this.state = {
      value: props.initValue
    };
  }

  static of<A>(props: StateWrapperProps<A>) {
    return React.createElement(
      StateWrapper as any as new () => StateWrapper<A>,
      props
    );
  }

  render(): React.ReactNode {
    let result = this.props.children(
      this.state.value,
      v => this.setState({value: v})
    );
    return (result === undefined) ? null : result;
  }
}

export class BooleanStateWrapper extends StateWrapper<boolean> {}
