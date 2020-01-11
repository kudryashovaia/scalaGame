import React from "react";

import {Redirect} from 'react-router-dom';
import {FormControl, FormGroup} from 'react-bootstrap';
import axios, {AxiosResponse} from 'axios';

import {history} from "./react-helpers/history";
import "./Login.scss";
import {auth} from "./auth";
import {AxiosAsyncButton} from "./react-helpers/AsyncButton";

interface LoginState {
  username: string;
  password: string;
  loginAs: string;
  loginAsEnabled: boolean;
  submitError: string;
}

export class Login extends React.Component<any, LoginState> {
  constructor(props: any) {
    super(props);
    this.state = {
      username: "",
      password: "",
      loginAs: "",
      loginAsEnabled: false,
      submitError: ""
    };
  }

  doLogin() {
    this.setState({ submitError: "" });
    let payload: any = {
      username: this.state.username,
      password: this.state.password,
      loginAs: this.state.username
    };
    if (this.state.loginAsEnabled) {
      payload.loginAs = this.state.loginAs;
    }
    console.log(payload);
    return axios.post("/login", payload);
  }

  onSuccess(response: AxiosResponse) {
    this.setState({ submitError: "" });
    auth.logIn(response.data);
    history.push("/");
  }

  onError(error: any) {
    if (error.response && error.response.status) {
      this.setState({ submitError: "Неверный логин или пароль." });
    } else {
      this.setState({ submitError: "Ошибка при подключении к серверу" });
    }
  }

  loginAsHandler = (event: any) => {
    if (event.altKey && event.which == 65) {
      this.setState({ loginAsEnabled: true });
    }
  };

  render() {
    if (auth.isLoggedIn()) {
      return (<Redirect to={{ pathname: "/" }} />);
    } else {
      return (
        <div className="container" onKeyDown={this.loginAsHandler}>
          <div className="row">
            <div className="col-sm-6 col-sm-offset-3 col-md-4 col-md-offset-4">
              <div className="account-wall">
                <div className="form-auth">
                  <form>

                    <div>
                      <FormGroup controlId="loginUsername" className="login-username-group">
                        <FormControl
                          type="text"
                          autoFocus
                          value={this.state.username}
                          onChange={(e) => this.setState({
                            username: (e.target as HTMLInputElement).value
                          })}
                          placeholder="E-mail"
                        />
                      </FormGroup>

                      <FormGroup controlId="loginPassword">
                        <FormControl
                          type="password"
                          value={this.state.password}
                          onChange={(e) => this.setState({
                            password: (e.target as HTMLInputElement).value
                          })}
                          placeholder="Пароль"
                        />
                      </FormGroup>

                      { this.state.loginAsEnabled ?
                        <FormGroup controlId="loginAs">
                          <FormControl
                            type="text"
                            value={this.state.loginAs}
                            onChange={(e) => this.setState({
                              loginAs: (e.target as HTMLInputElement).value
                            })}
                            placeholder=""
                          />
                        </FormGroup> : "" }

                    </div>

                    <AxiosAsyncButton
                      type="submit"
                      bsStyle="primary"
                      bsSize="large"
                      block
                      disabled={this.state.username.length == 0 ||
                      this.state.password.length == 0}
                      onClick={() => this.doLogin()}
                      onSuccess={(r) => this.onSuccess(r)}
                      onError={(err) => this.onError(err)}
                    >Вход</AxiosAsyncButton>

                    {this.state.submitError != "" ?
                      <div className="alert alert-danger">{this.state.submitError}</div> :
                      null
                    }

                    <div style={{marginTop: "0.5em"}}>
                      <a onClick={() => history.push("/forgot-password")}
                         className="btn-link pull-right"
                         style={{cursor: "pointer"}}
                      >Забыли пароль?</a>
                      <div className="clearfix"/>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }
}
