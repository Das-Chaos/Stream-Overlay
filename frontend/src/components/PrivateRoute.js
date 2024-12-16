import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const PrivateRoute = ({ component: Component, allowedRoles, ...rest }) => {
  const token = localStorage.getItem('token');
  let userRole = null;

  if (token) {
    const decodedToken = JSON.parse(atob(token.split('.')[1]));
    userRole = decodedToken.role;
  }

  return (
    <Route
      {...rest}
      render={(props) =>
        token && allowedRoles.includes(userRole) ? (
          <Component {...props} />
        ) : (
          <Redirect to="/login" />
        )
      }
    />
  );
};

export default PrivateRoute;
