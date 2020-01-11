import React from "react";
import {Redirect, Route, Switch} from "react-router";

import {NewsPage} from "./NewsPage";
import {Permissions} from "./util/Permissions";
import {BlackJack} from "./games/BlackJack";
import {TicTacToe} from "./games/TicTacToe";

export class Routes extends React.Component<any> {
  render() {
    let routes: {
      link: string,
      exact?: boolean,
      permissions?: string[],
      component: React.ComponentType<any>
    }[] = [
      { link: "/news", component: NewsPage },

      { link: "/black-jack", component: BlackJack},
      { link: "/tic-tac-toe", component: TicTacToe}
    ];

    let routeNodes: React.ReactNode[] = [];
    routes.forEach(route => {
      if (!route.permissions || Permissions.isAnyPathPermitted(this.props.permissions, route.permissions)) {
        routeNodes.push(
          <Route key={routeNodes.length} path={route.link} component={route.component} exact={route.exact} />
        );
      }
    });

    return (
      <Switch>
        {routeNodes}
        <Route render={() => <Redirect to="/news" /> } />
      </Switch>
    )
  }
}
