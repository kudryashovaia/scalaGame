import React from "react";
import {Form} from "react-bootstrap";
import _ from "lodash";
import {FormBind} from "./FormBind";
import {Bind} from "../bind/Bind";

export interface SmartFormProps<T> {
  bind: Bind<T>,
  onValidChange?: (valid: boolean) => void;
  vertical?: boolean;
  skipFormTag?: boolean;
  children: (args: {
    item: FormBind<T>,
    isFormValid: boolean,
    vertical: boolean
  }) => React.ReactNode;
}

export type SmartInputError = { message: string, fresh: boolean };

interface SmartFormState {
  errors: {[key: string]: SmartInputError};
  isValid: boolean;
}

export class SmartForm<T> extends React.Component<SmartFormProps<T>, SmartFormState> {

  constructor(props: SmartFormProps<T>) {
    super(props);
    this.state = {
      errors: {},
      isValid: true
    }
  }

  static of<A>(props: SmartFormProps<A>) {
    return React.createElement(
      SmartForm as any as new () => SmartForm<A>,
      props
    );
  }

  static setValue(obj: any, keys: string[], value: any): void {
    if (obj) {
      if (keys.length == 1) {
        obj[keys[0]] = value;
      } else {
        SmartForm.setValue(obj[keys[0]], keys.slice(1), value);
      }
    }
  }

  render(): React.ReactNode {
    let children = this.props.children({
      item: FormBind.wrap(this.props.bind, this),
      isFormValid: this.isValid(),
      vertical: this.props.vertical
    });
    if (this.props.skipFormTag) {
      return (
        <React.Fragment>
          {children}
        </React.Fragment>
      );
    } else {
      return (
        <Form horizontal={!this.props.vertical} onSubmit={(e) => e.preventDefault()}>
          {children}
        </Form>
      );
    }
  }

  isValid() {
    return _.values(this.state.errors).length == 0;
  }

  updateError(prop: string, message: string, fresh: boolean) {
    this.setState(prevState => {
      let errors = _.cloneDeep(prevState.errors);
      if (message) {
        errors[prop] = { message: message, fresh: fresh };
      } else {
        delete errors[prop];
      }
      return { errors: errors };
    }, () => {
      if (this.props.onValidChange) {
        this.props.onValidChange(this.isValid());
      }
    });
  }

  getError(prop: string): SmartInputError {
    return this.state.errors[prop];
  }

}
