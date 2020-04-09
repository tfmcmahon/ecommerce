import React, { useState } from 'react'
import Layout from '../layout/LayoutComponent'
import { Link, withRouter } from 'react-router-dom'

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

    const handleChange = () => event => {
        let { name, value } = event.target
        setValues({
            ...values,                  // get the rest of the values
            error: false,               //if the user retries, hide the error
            [name]: value               //set the name argument key to the value
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
                name='name'
                placeholder="Username*" 
                className="submitUsername"
            />
            <br />
            <input
                onChange={handleChange()}
                type="text" 
                name='email'
                placeholder="Email address*" 
                className="submitUsername"
            />
            <br />
            <input
                onChange={handleChange()}
                type="password" 
                name="password" 
                placeholder="Password*" 
                className="submitUsername"
            />
            <br />
            <input
                onChange={handleChange()}
                type="password" 
                name="password2" 
                placeholder="Confirm password*" 
                className="submitUsername"
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
                <div className="horizontalRuleSmall"></div>
                <p className="registerLinkText">Already have an account? <Link to="/login"> <b>Login</b></Link></p>
                <p className="registerLinkText">Back to <Link to="/"> <b>Home</b></Link></p>
                <br />
                <img src={Transition} alt="transition graphic" className="landingImage"></img>
            </div>
        </Layout>
    )
}

export default withRouter(Register)
