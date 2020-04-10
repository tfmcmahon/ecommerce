import React, { useState } from 'react'
import Layout from '../layout/LayoutComponent'
import { Link, withRouter } from 'react-router-dom'
import { register } from '../../actions/authActions'

import Transition from '../../images/transition1.svg'


const Register = () => {
    const [values, setValues] = useState({
        name: '',
        email: '',
        password: '',
        password2: '',
        error: '',
        success: false
    })

    let { name, email, password, password2, error, success } = values

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
        register({ name, email, password, password2 })
            .then(data => {
                if (data.data.error) {       //if the backend throws an error, put it into the state
                    setValues({
                        ...values,
                        error: data.data.error,
                        success: false
                    })
                } else {                //if no error, reset the state
                    setValues({
                        name: '',
                        email: '',
                        password: '',
                        password2: '',
                        error: '',
                        success: true
                    })
                }
            })
    }

    const registrationFrom = () => (
        <form 
        noValidate 
        className="loginFormHelp" 
        >
            <input 
                onChange={handleChange()}
                type="text"
                name="name"
                placeholder="Username*" 
                className="submitUsername"
                value={name}
            />
            <br />
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
            <br />
            <input
                onChange={handleChange()}
                type="password" 
                name="password2" 
                placeholder="Confirm password*" 
                className="submitUsername"
                value={password2}
            />

            <button 
                onClick={handleSubmit}
                type="submit" 
                className="submitLoginButton"
            >
                Register
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
            <p 
                className="successText"
                style={{ display: success ? '' : 'none' }}
            >
                Registration successful! Please 
                <Link to='/login'>
                    <b className="registerLinkTextBold"> Login</b>
                </Link>
            </p>
        </div>
    )

    return (
        <Layout 
        title='Registration Page'
        description='Register for the MERN E-commerce App'
        >
            <div className="login">
                <div className="loginWrapper">
                    <div className="loginForm">
                        <h3 className="loginTitle">Register</h3>
                            {registrationFrom()}
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
                    <Link to="/"> 
                        <b className="registerLinkTextBold"> Home</b>
                    </Link>
                </p>
                <br />
                <img src={Transition} alt="transition graphic" className="landingImage"></img>
            </div>
        </Layout>
    )
}

export default withRouter(Register)
