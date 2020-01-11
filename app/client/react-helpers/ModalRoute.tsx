import React from "react";

import {Route, match} from "react-router-dom";

export const ModalRoute = (props: {
  path: string,
  exact?: boolean,
  children: (args: {show: boolean, match?: match<any>}) => React.ReactNode
}) => (
  <Route path={props.path} exact={props.exact} children={({match}) =>
    props.children({
      show: !!match,
      match: match
    })
  } />
);

