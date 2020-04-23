import React, { useState, useEffect, Fragment } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../layout/LayoutComponent'
import { getUser, isAuthenticated } from '../../actions/authActions'
import { getAllProducts, deleteProduct } from '../../actions/productActions'


const ManageProducts = () => {
    const [products, setProdcuts] = useState([])

    const userId = getUser()._id
    const token = isAuthenticated()

    useEffect(() => {
        getAllProducts()
            .then(data => {
                if (data.data.error) {
                    console.log(data.data.error)
                } else {
                    setProdcuts(data.data)
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

    return (
        <Layout 
        title='Manage Products'
        description='Perform CRUD on products'
        >
            <div className='productDBWrapper'>
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
            </div>
        </Layout>
    )
}

export default ManageProducts