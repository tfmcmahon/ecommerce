import React, { Component } from 'react'
import { Route, Redirect, withRouter } from 'react-router-dom'
import { isAuthenticated, getUser } from '../../actions/authActions'

// A wrapper for <Route> that redirects to the login
// screen if you're not yet authenticated.
const AdminRoute = ({ component: Component, ...rest }) => {
    return (
        <Route
            {...rest}
            render={props =>
                isAuthenticated() && getUser().role === 1
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

export default withRouter(AdminRoute)