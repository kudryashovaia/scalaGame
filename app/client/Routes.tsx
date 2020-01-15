import React from "react";
import {Redirect, Route, Switch} from "react-router";

import {NewsPage} from "./NewsPage";
import {BlackJack} from "./games/BlackJack";
import {TicTacToe} from "./games/tic-tac-toe/TicTacToe";

export class Routes extends React.Component<any> {
  render() {
    let routes: {
      link: string,
      exact?: boolean,
      component: React.ComponentType<any>
    }[] = [
      { link: "/news", component: NewsPage },

      { link: "/black-jack", component: BlackJack},
      { link: "/tic-tac-toe", component: TicTacToe}
    ];

    let routeNodes: React.ReactNode[] = [];
    routes.forEach(route => {
        routeNodes.push(
          <Route key={routeNodes.length} path={route.link} component={route.component} exact={route.exact} />
        );
    });

    return (
      <Switch>
        {routeNodes}
        <Route render={() => <Redirect to="/news" /> } />
      </Switch>
    )
  }
}
