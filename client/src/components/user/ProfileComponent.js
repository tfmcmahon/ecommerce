import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../layout/LayoutComponent'
import { isAuthenticated, getUser } from '../../actions/authActions'
import { readUser, updateUser, updateUserLocal } from '../../actions/userActions'

const Profile = () => {
    //initialize state that contains user info
    const [values, setValues] = useState({
        name: '',
        email: ''
    })
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)
    const [password, setPassword] = useState('')

    //destructure state for brevity
    const { name, email } = values
    const userId = getUser()._id
    const token = isAuthenticated()

    useEffect(() => {
        readUser(userId, token)
            .then(data => {
                if (data.data.error) {
                    setError(data.data.error)
                } else {
                    setValues({
                        name: data.data.name,
                        email: data.data.email
                    })
                }
            })
    }, [userId, token])

    const handleChange = () => event => {
        let { name, value } = event.target
        setValues({
            ...values,
            [name]: value
        })

    }

    const handlePasswordChange = () => event => {
        setPassword(event.target.value)
        setError('')
    }

    const handleSubmit = event => {
        event.preventDefault()
        let userData = { name, email, password }
        updateUser(userId, token, userData)
            .then(data => {
                if (data.data.error) {
                    setError(data.data.error)
                } else {
                    updateUserLocal(data, () => { //callback
                        setValues({
                            name: data.data.name,
                            email: data.data.email
                        })
                        setSuccess(true)
                    })
                }
            })
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
                onChange={handlePasswordChange()}
                type="text" 
                name="password" 
                placeholder="Password*" 
                className="submitUsername"
                value={password}
            />
            <div className='buttonWrapperUpdate'>
                <button 
                    onClick={handleSubmit}
                    type="submit" 
                    className="cartButton"
                >
                    Update
                </button>
                <Link to='/user/dashboard'>
                    <button 
                        className="navButton"
                    >
                        Dashboard
                    </button>
                </Link>
            </div>
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
                Profile updated successfully!
            </p>
        </div>
    )

    return (
        <Layout
        title='Profile'
        description='View or update your profile settings'
        >
            <div className="loginWrapper">
                <div className="loginForm">
                    {profileUpdateForm(name, email, password)}
                </div>
                <br/>
                {showServerMessage()}
            </div>
        </Layout>
    )
}

export default Profile