import React from 'react';
import {Link, Route} from 'react-router-dom';

export const NavbarLink = (props: {
  to: string,
  exact?: boolean,
  children?: string
}) =>
  <Route path={props.to} exact={props.exact} children={ (rprops: any) => {
    return (
      <li role="presentation" className={rprops.match ? "active" : ""}>
        <Link to={props.to} replace={rprops.match && rprops.match.isExact}>{props.children}</Link>
      </li>
    );
  }} />;
