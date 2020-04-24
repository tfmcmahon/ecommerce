import React, { useState } from 'react'
import Layout from '../layout/LayoutComponent'
import { Link, withRouter, Redirect } from 'react-router-dom'
import { login, authenticate, getUser, isAuthenticated } from '../../actions/authActions'


const Login = () => {
    const [values, setValues] = useState({
        email: '',
        password: '',
        error: '',
        loading: false,
        redirectToReferrer: false
    })

    let { email, password, error, loading, redirectToReferrer } = values
    let { role } = getUser()

    const handleChange = () => event => {
        let { name, value } = event.target
        setValues({
            ...values,                  // get the rest of the values
            error: false,               //if the user retries, hide the error
            [name]: value               //set the name argument key to the value
        })
    }
    
    const handleSubmit = event => {
        event.preventDefault()
        setValues({ ...values, error: false, loading: true })
        login({ email, password })
            .then(data => {
                if (data.data.error) {       //if the backend throws an error, put it into the state
                    setValues({
                        ...values,
                        error: data.data.error,
                        loading: false
                    })
                } else {                    //if no error, authenticate the user by passing the token to the authenticate action
                    authenticate(data.data, () => {
                        setValues({
                            ...values,
                            redirectToReferrer: true
                        })
                    })
                }
            })
    }

    const loginForm = () => (
        <form 
        noValidate 
        className="loginFormHelp" 
        >
            <input
                onChange={handleChange()}
                type="text" 
                name="email"
                placeholder="Email address*" 
                className="submitUsername"
                value={email}
            />
            <br />
            <input
                onChange={handleChange()}
                type="password" 
                name="password" 
                placeholder="Password*" 
                className="submitUsername"
                value={password}
            />

            <button 
                onClick={handleSubmit}
                type="submit" 
                className="submitLoginButton"
            >
                Login
            </button>
        </form>
    )

    const showServerMessage = () => (
        //display errors per the error state
        <div className="errorWrapper">
            <p 
                className="errorText"
                style={{ display: error ? '' : 'none' }}
            >
                {error}
            </p>
        </div>
    )

    const showLoading = () => (
        loading && 
        <div className="loadingWrapper">
            <div className="loading"></div>
        </div>
    )

    const redirectUser = () => {
        //check the user role and redirect accordingly after successful login
        if (redirectToReferrer) {
            if (role && role === 1) {
                return <Redirect to='/admin/dashboard' />
            } else {
                return <Redirect to='/user/dashboard' />
            }
        }
        if (isAuthenticated()) {
            return <Redirect to='/search' />
        }
    }

    return (
        <Layout 
        title='Login Page'
        description='Login to the Poster shop App'
        >
            <div className="login">
                <div className="loginWrapper">
                    <div className="loginForm">
                            {loginForm()}
                    </div>
                </div>
                {showServerMessage()}
                <div className="horizontalRuleSmall"></div>
                <p className="registerLinkText">Already have an account? 
                    <Link to="/login"> 
                        <b className="registerLinkTextBold"> Login</b>
                    </Link>
                </p>
                <p className="registerLinkText">Back to 
                    <Link to="/search"> 
                        <b className="registerLinkTextBold"> Home</b>
                    </Link>
                </p>
                <br />
                {showLoading()}
                {redirectUser()}
            </div>
        </Layout>
    )
}

export default withRouter(Login)