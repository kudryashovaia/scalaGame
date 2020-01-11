import React, {ReactNode} from "react";
import _ from "lodash";

import {Field} from "./Field";
import {SmartInput, SmartInputProps} from "./SmartInput";

export interface SmartFieldProps<T> extends SmartInputProps<T> {
  title: string | React.ReactNode;
}

export abstract class StatefulSmartField<T, P, S> extends React.Component<P & SmartFieldProps<T>, S> {
  constructor(props: P & SmartFieldProps<T>) {
    super(props);
    this.state = this.initState();
  }

  protected abstract initState(): S;

  abstract renderInput(): ReactNode;

  protected smartInputProps(): SmartInputProps<T> {
    return _.pick(this.props, "value", "onChange", "bind", "hasErrors", "required");
  }

  render() {
    let error = this.props.bind && this.props.bind.getError();
    let errorMessage = error && !error.fresh && error.message;
    return (
      <Field title={this.props.title}
             validationState={errorMessage ? "error" : null}
             vertical={this.props.bind && this.props.bind.isFormVertical()}
      >
        {this.renderInput()}
        {
          errorMessage &&
          <span className="help-block">{errorMessage}</span>
        }
      </Field>
    );
  }
}

export abstract class SmartField<T, P> extends StatefulSmartField<T, P, {}> {
  initState() {
    return {};
  }

  static compareProps<T>(props: SmartFieldProps<T>, nextProps: SmartFieldProps<T>): boolean {
    return props.title != nextProps.title || SmartInput.compareProps(props, nextProps);
  }
}
