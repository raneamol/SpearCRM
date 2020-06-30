import React, {useContext} from 'react';
import { Route, Redirect } from "react-router-dom";
import AuthContext from './AuthContext.js';

export default function PrivateRoute({ component: Component, ...rest }) {
  
  const authToken = useContext(AuthContext)
  //authToken could probably be renamed as isAuthenticated, with no difference being made effectively

  return (
    <Route
      render={(props) =>
        authToken ? 
        <Component {...props} {...rest} />  
        : <Redirect to="/" />
      }
    />
  );
}
