import React, { Component } from 'react'
import { Route, Redirect, withRouter } from 'react-router-dom'
import { isAuthenticated } from '../../actions/authActions'

// A wrapper for <Route> that redirects to the login
// screen if you're not yet authenticated.
const PrivateRoute = ({ component: Component, ...rest }) => {
    return (
        <Route
            {...rest}
            render={props =>
                isAuthenticated() 
                ? (<Component {...props} />) 
                : (
                    <Redirect
                    to={{
                        pathname: "/login",
                        state: { from: props.location }
                    }}
                    />
                )
            }
        />
    )
}

export default withRouter(PrivateRoute)