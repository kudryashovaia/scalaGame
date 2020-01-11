import React, {CSSProperties} from "react";
import {Col, ControlLabel, FormGroup} from "react-bootstrap";

interface FieldProps {
  title?: string | React.ReactNode;
  validationState?: "success" | "warning" | "error";
  vertical?: boolean;
  className?: string;
  style?: CSSProperties;
}
export class Field extends React.Component<FieldProps,{}> {

  render() {
    return (
      <FormGroup validationState={this.props.validationState} style={this.props.style} className={this.props.className}>
        <Col componentClass={ControlLabel} sm={this.props.vertical ? null : 3}>{this.props.title}</Col>
        <Col sm={this.props.vertical ? null : 9}>
          {this.props.children}
        </Col>
      </FormGroup>
    );
  }
}
