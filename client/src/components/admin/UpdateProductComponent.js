import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../layout/LayoutComponent'
import { getUser, isAuthenticated } from '../../actions/authActions'
import { getSingleProduct, updateProduct } from '../../actions/productActions'
import { getCategories } from '../../actions/categoryActions'


const UpdateProduct = (props) => {
    //set up values (product fields) state per the product schema
    const [values, setValues] = useState({
        name: '',
        description: '',
        price: '',
        category: '',
        shipping: '',
        quantity: ''
    })
    const [error, setError] = useState('')
    const [formData, setFormData] = useState('')
    const [categories, setCategories] = useState([])
    const [photoMessage, setPhotoMessage] = useState('Upload Photo')
    const [loading, setLoading] = useState(false)
    const [createdProduct, setCreatedProduct] = useState('')

    //destructure values state for cleaner variables:
    const {
        name,
        description,
        price,
        quantity
    } = values

    //destructure user and token from local storage
    let token = isAuthenticated()
    let userId = getUser()._id
    let productId = props.match.params.productId

    //load categories and set form data
    useEffect(() => {

        getSingleProduct(productId)
            .then(data => {
                if (data.data.error) {
                    setError(data.data.error)
                } else {
                    setValues({
                        name: data.data.name,
                        description: data.data.description,
                        price: data.data.price,
                        category: data.data.category._id,
                        shipping: data.data.shipping,
                        quantity: data.data.quantity,
                    })
                    setFormData(new FormData())
                }
            })

        getCategories()
            .then(data => {
                if (data.data.error) {          //if the backend throws an error, put it into the state
                    setError(data.data.error)
                } else {                        //if no error, set form data and categories
                    setFormData(new FormData())
                    setCategories(data.data.data)
                }
            })
    }, [productId])

    const handleChange = () => event => {
        let { id, value } = event.target
        formData.set(id, value)
        setValues({
            ...values,
            [id]: value
        })
    }

    //handle file upload button display
    const getUploadedFileName = () => event => {
        let { files, value } = event.target
        let message
        if (files && files.length > 1) {
            message = `${files.length} files selected`
        } else { 
            message = value.split('\\').pop()
        }
        if (message) {
            setPhotoMessage(message)
        }
        formData.set('photo', files[0]) // field 'photo' required for the backend to recognize it
    }

    const handleSubmit = event => {
        event.preventDefault()
        setError('')
        setLoading(true)
        updateProduct(productId, userId, token, formData)
            .then(data => {
                if (data.data.error) {          //if the backend throws an error, put it into the state
                    setError(data.data.error)
                    setLoading(false)
                } else {                        //if no error, set success to true
                    setValues({
                        ...values,
                        name: '',
                        description: '',
                        price: '',
                        quantity: '',
                    })
                    setLoading(false)
                    setCreatedProduct(data.data.data.name)
                }
            })
    }

    const newProductForm = () => (
        <form 
        className="loginFormHelp" 
        >
            <input 
                onChange={getUploadedFileName()}
                type="file"
                id='photo'
                accept='image/*'
                className="submitPhoto"
                data-multiple-caption={photoMessage}
                multiple
            />
            <label htmlFor="photo"> {photoMessage} </label>
            <br />
            <input
                onChange={handleChange()}
                type="text" 
                id="name"
                placeholder="Product Name*" 
                className="submitUsername"
                value={name}
            />
            <br />
            <textarea
                onChange={handleChange()}
                id="description" 
                placeholder="Product Description*" 
                className="productDescription"
                value={description}
            />
            <br />
            <input
                onChange={handleChange()}
                type="number" 
                id="price"
                placeholder='Price*'
                className="submitUsernamePrice"
                value={price}
            />
            <br />
            <select
                onChange={handleChange()}
                id="category" 
                className="submitUsername"
                required={true}
            >
                <option className='grayOption' value=''>Select a Category...</option>
                {categories.length > 0 && categories.map((category, index) => (
                    <option value={category._id} key={index}>{category.name}</option>
                ))}
            </select>
            <br />
            <input
                onChange={handleChange()}
                type="number" 
                id="quantity"
                placeholder='Quantity*'
                className="submitUsername"
                value={quantity}
            />
            <br />
            <select
                onChange={handleChange()}
                id="shipping" 
                className="submitUsername"
                required={true}
            >
            <option className='grayOption' value=''>Shipping method...</option>
            <option value='1'>Shipped</option>
                <option value='0'>Digital</option>
            </select>
            <div className='buttonRow'>
                <button 
                    onClick={handleSubmit}
                    type="submit" 
                    className="submitLoginButton"
                >
                    Update
                </button>
                <Link to='/admin/products' className=''>
                    <button className='navButton'>
                        Manage Products
                    </button>
                </Link>
            </div>
        </form>
    )

    const showServerMessage = () => (
        //display errors or success per the state
        <div className="errorWrapper">
            <p 
                className="errorText"
                style={{ display: error ? '' : 'none' }}
            >
                {error}
            </p>
            <p 
                className="successText"
                style={{ display: createdProduct ? '' : 'none' }}
            >
                {createdProduct} was updated successfully! 
            </p>
        </div>
    )

    const showLoading = () => (
        loading && 
        <div className="loadingWrapper">
            <div className="loading"></div>
        </div>
    )

    return (
        <Layout 
        title='Update Poster'
        description='Update an existing poster'
        >
            <div className="login">
                <div className="loginWrapper">
                    <div className="categoryForm">
                        {newProductForm()}
                    </div>
                </div>
                {showServerMessage()}
                {showLoading()}
            </div>
        </Layout>
    )
}

export default UpdateProduct