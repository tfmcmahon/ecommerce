import React, { useState, useEffect, Fragment } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../layout/LayoutComponent'
import { getUser, isAuthenticated } from '../../actions/authActions'
import { getAllProducts, deleteProduct } from '../../actions/productActions'


const ManageProducts = () => {
    const [products, setProdcuts] = useState([])
    const [loading, setLoading] = useState(true)

    const userId = getUser()._id
    const token = isAuthenticated()

    useEffect(() => {
        setLoading(true)
        getAllProducts()
            .then(data => {
                if (data.data.error) {
                    console.log(data.data.error)
                    setLoading(false)
                } else {
                    setProdcuts(data.data)
                    setLoading(false)
                }
            })
    }, [])

    const loadProdcuts = () => {
        getAllProducts()
            .then(data => {
                if (data.data.error) {
                    console.log(data.data.error)
                } else {
                    setProdcuts(data.data)
                }
            })
    }

    const removeProduct = productId => {
        deleteProduct(productId, userId, token)
            .then(data => {
                if (data.data.error) {
                    console.log(data.data.error)
                } else {
                    loadProdcuts()
                }
            })
    }
    
    const showLoading = () => (
        loading && 
        <div className="loadingWrapper">
            <div className="loading"></div>
        </div>
    )

    return (
        <Layout 
        title='Manage Posters'
        description='Perform CRUD on posters'
        >
            <div className='productDBWrapper'>
                { loading
                ? showLoading()
                :<Fragment>       
                    <p className='productsLength'>Showing {products.length} products</p>
                    <ul className='orderList'>
                        {products.map((product, index) => (
                            <Fragment key={index}>
                                <li className='productOrderWrapperInner2' >
                                    <p className='productOrderKeyItem'>{product.name}</p>
                                    <Link to={`/admin/product/update/${product._id}`} >
                                        <button
                                            className="homeButton"
                                        >
                                            Update
                                    </button>
                                    </Link>
                                    <button
                                        onClick={() => removeProduct(product._id)}
                                        className="navButton"
                                    >
                                            Delete
                                    </button>
                                </li>
                                <div className='horizontalRule'></div>
                            </Fragment>
                        ))}
                    </ul>
                </Fragment>     
                }
            </div>
        </Layout>
    )
}

export default ManageProducts