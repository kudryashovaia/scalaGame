import React from "react";
import Bluebird from "bluebird";

import {Button, Sizes} from "react-bootstrap";
import {AxiosResponse} from "axios";

import "./AsyncButton.scss";
import {Confirm} from "../util/Confirm";

interface AsyncButtonProps<R> {
  type?: string;
  bsStyle?: string;
  bsSize?: Sizes;
  block?: boolean;
  active?: boolean;
  disabled?: boolean;
  className?: string;
  title?: string;
  onClick: () => PromiseLike<R>;
  onSuccess: (r: R) => void;
  onError?: (error: any) => any;
}

interface AsyncButtonState {
  inProgress: boolean;
}

export class AsyncButton<R> extends React.Component<AsyncButtonProps<R>, AsyncButtonState> {
  constructor(props: AsyncButtonProps<R>) {
    super(props);
    this.state = {
      inProgress: false
    };
  }
  onClick(e: React.MouseEvent<Button>) {
    this.setState({ inProgress: true });
    try {
      Bluebird.resolve(this.props.onClick())
      .then((result) => {
        this.setState({inProgress: false});
        this.props.onSuccess(result);
        return null;
      })
      .catch((error) => {
        this.setState({inProgress: false});
        if (this.props.onError) {
          this.props.onError(error);
        } else {
          Confirm.errorHandler(error);
        }
      });
    } catch (err) {
      Confirm.errorHandler(err);
    }
    e.stopPropagation();
    e.preventDefault();
  }
  render() {
    return (
      <Button
        onClick={(e) => this.onClick(e)}
        type={this.props.type}
        bsStyle={this.props.bsStyle}
        bsSize={this.props.bsSize}
        block={this.props.block}
        disabled={this.state.inProgress || this.props.disabled}
        className={(this.props.className || "") + " " + (this.state.inProgress ? "btn-progress" : "")}
        title={this.props.title}
      >{this.props.children}</Button>
    );
  }
}

export class AxiosAsyncButton extends AsyncButton<AxiosResponse> {}
