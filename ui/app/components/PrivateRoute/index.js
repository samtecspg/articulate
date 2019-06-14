import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { checkCookie } from '../../utils/cookies';

const PrivateRoute = ({ component: Component, isAuthEnabled, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      checkCookie() !== null || !isAuthEnabled ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: '/login',
            state: { from: props.location },
          }}
        />
      )
    }
  />
);

export default PrivateRoute;
