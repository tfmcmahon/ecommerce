import React, { useState, useEffect } from 'react'
import { Link, Redirect } from 'react-router-dom'
import Layout from '../layout/LayoutComponent'
import { isAuthenticated, getUser } from '../../actions/authActions'
import { readUser, updateUser, updateUserLocal } from '../../actions/userActions'

const Profile = () => {
    //initialize state that contains user info
    const [values, setValues] = useState({
        name: '',
        email: '',
        password: '',
        error: '',
        success: false
    })

    //destructure state for brevity
    const { name, email, password, error, success } = values
    const userId = getUser()._id
    const token = isAuthenticated()

    useEffect(() => {
        readUser(userId, token)
            .then(data => {
                if (data.data.error) {
                    setValues({
                        ...values,
                        error: data.data.error
                    })
                } else {
                    setValues({
                        ...values,
                        name: data.data.name,
                        email: data.data.email
                    })
                }
            })
    }, [])

    const handleChange = () => event => {
        let { name, value } = event.target
        setValues({
            ...values,
            [name]: value,
            error: ''
        })
    }

    const handleSubmit = event => {
        event.preventDefault()
        let userData = { name, email, password }
        updateUser(userId, token, userData)
            .then(data => {
                if (data.data.error) {
                    setValues({
                        ...values,
                        error: data.data.error
                    })
                } else {
                    updateUserLocal(data, () => { //callback
                        console.log('callback')
                        setValues({
                            ...values,
                            name: data.data.name,
                            email: data.data.email,
                            success: true
                        })
                    })
                }
            })
    }

    const redirectUser = success => {
        if (success) {
            return <Redirect to='/cart'/>
        }
    }

    const profileUpdateForm = (name, email, password) => (
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
                placeholder="Email*" 
                className="submitUsername"
                value={email}
            />
            <br />
            <input
                onChange={handleChange()}
                type="text" 
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
                Update
            </button>
        </form>
    )

    return (
        <Layout
        title='Profile'
        description={`View or update your profile settings`}
        >
            <div className="loginWrapper">
                <div className="loginForm">
                    {profileUpdateForm(name, email, password)}
                    {redirectUser(success)}
                    {JSON.stringify(values)}
                </div>
            </div>
        </Layout>
    )
}

export default Profile