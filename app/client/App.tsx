import React from 'react';
import $ from "jquery";
import './App.css';
import {Route, Router, Switch} from 'react-router-dom';

import {history} from "./react-helpers/history";
import {Login} from "./Login";
import {Main} from "./Main";

export default class App extends React.Component<any, any> {
  componentDidMount() {
    $("#init-load-overlay").remove();
  }
  render() {
    return (
      <Router history={history}>
        <div>
          <Switch>
            <Route exact path="/login" component={Login} />
            <Route path="/" component={Main} />
          </Switch>
        </div>
      </Router>
    );
  }
}
