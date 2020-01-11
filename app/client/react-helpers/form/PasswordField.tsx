import React from "react";
import {FormBind} from "./FormBind";
import {Field} from "./Field";
import {StringInput} from "./StringField";
import {CheckboxInput} from "./CheckboxField";

interface PasswordFieldProps {
  title: string;
  passwordBind?: FormBind<string>;
  passwordValue?: string;
  passwordOnChange?: (password: string) => void;
  generatePasswordBind?: FormBind<boolean>;
  generatePasswordValue?: boolean;
  generatePasswordOnChange?: (generatePassword: boolean) => void;
}

interface PasswordFieldState {
  showPassword: boolean;
}

export class PasswordField extends React.Component<PasswordFieldProps, PasswordFieldState> {
  constructor(props: PasswordFieldProps) {
    super(props);
    this.state = {
      showPassword: false
    };
  }

  render() {
    let generatePasswordValue =
      (this.props.generatePasswordBind && this.props.generatePasswordBind.getValue()) ||
      (this.props.generatePasswordValue);
    return (
      <Field title={this.props.title}>
        <div className="input-group">
          <div
            className="input-group-addon"
            style={{cursor: "pointer"}}
            onClick={() => this.setState(prevState => ({showPassword: !prevState.showPassword}))}
          >
            <i className={"fa fa-fw " + (this.state.showPassword ? "fa-eye-slash" : "fa-eye")} />
          </div>

          <StringInput
            type={this.state.showPassword ? "text" : "password"}
            bind={this.props.passwordBind}
            value={this.props.passwordValue}
            onChange={this.props.passwordOnChange}
            disabled={generatePasswordValue}
          />
        </div>

        <CheckboxInput
          unstyled
          bind={this.props.generatePasswordBind}
          value={this.props.generatePasswordValue}
          onChange={v => {
            if (this.props.passwordBind) {
              this.props.passwordBind.setValue(undefined);
            }
            if (this.props.passwordOnChange) {
              this.props.passwordOnChange(undefined);
            }
            if (this.props.generatePasswordOnChange) {
              this.props.generatePasswordOnChange(v)
            }
          }}
        >
          Сгенерировать пароль
        </CheckboxInput>

        {
          generatePasswordValue &&
          <p className="small">
            После сохранения карточки пароль будет сгенерирован автоматически и отправлен пользователю на почту.
          </p>
        }
      </Field>
    );
  }
}
