import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../layout/LayoutComponent'
import { getUser, isAuthenticated } from '../../actions/authActions'
import { createCategory } from '../../actions/categoryActions'

const AddCategory = () => {
    const [category, setCategory] = useState('')
    const [error, setError] = useState(false)
    const [success, setSuccess] = useState(false)

    //destructure user and token from local storage
    let token = isAuthenticated()
    let { _id } = getUser()

    const handleChange = event => {
        setError('')
       let { value } = event.target
       setCategory(value)
    }

    const handleSubmit = event => {
        event.preventDefault()
        setError('')
        setSuccess(false)
        //make backend request
        createCategory(_id, token, { 'name': category }) //send category as an object to avoid JSON rejections
            .then(data => {
                if (data.data.error) {          //if the backend throws an error, put it into the state
                    setError(data.data.error)
                } else {                        //if no error, set success to true
                    setError('')
                    setSuccess(true)
                }
            })
    }

    const showServerMessage = () => (
        //display errors per the error state
        <div className="errorWrapper">
            <p 
                className="errorText"
                style={{ display: error ? '' : 'none' }}
            >
                That category name is already in use.
            </p>
            <p 
                className="successText"
                style={{ display: success ? '' : 'none' }}
            >
                Category created successfully! 
            </p>
        </div>
    )

    const newCategoryForm = () => (
        <form         
            noValidate 
            className="loginFormHelp" 
        >
            <input 
                type='text' 
                className='submitUsername'
                onChange={handleChange}
                value={category}
                autoFocus
            />
            <div className='buttonRow'>
                <button 
                    onClick={handleSubmit}
                    type="submit" 
                    className="submitLoginButton"
                >
                    Create
                </button>
                <Link to='/admin/dashboard' className=''>
                    <button className='navButton'>
                        Dashboard
                    </button>
                </Link>
            </div>
        </form>
    )


    return (
        <Layout 
        title='Create Categories'
        description='Create a new product category'
        >
            <div className="login">
                <div className="loginWrapper">
                    <div className="categoryForm">
                        {newCategoryForm()}
                    </div>
                </div>
                {showServerMessage()}
            </div>
        </Layout>
    )
}

export default AddCategory