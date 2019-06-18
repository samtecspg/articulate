import PropTypes from 'prop-types';
import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { checkCookie } from '../../utils/cookies';

const PrivateRoute = ({ component: Component, isAuthEnabled, ...rest }) => {
  console.log(`index::PrivateRoute`); // TODO: REMOVE!!!!
  console.log({ isAuthEnabled }); // TODO: REMOVE!!!!
  return (
    <Route
      {...rest}
      render={props =>
        isAuthEnabled && checkCookie() === null ? (
          <Redirect
            to={{
              pathname: '/login',
              state: { from: props.location },
            }}
          />
        ) : (
          <Component {...props} />
        )
      }
    />
  );
};

PrivateRoute.propTypes = {
  component: PropTypes.any,
  isAuthEnabled: PropTypes.bool,
};
export default PrivateRoute;
