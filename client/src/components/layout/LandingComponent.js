import React, { useState, useEffect } from 'react'
import Layout from './LayoutComponent'
import { getProducts } from '../../actions/productActions'
import ProductCard from '../product/ProductCardComponent'
import Transition from '../../images/transition1.svg'

const Landing = () => {
    //state setup
    const [productsBySold, setProductsBySold] = useState([])
    const [productsByArrival, setProductsByArrival] = useState([])
    const [error, setError] = useState('')

    //product sort methods -- used when component mounts
    const getProductsBySold = () => {
        getProducts('sold')
        .then(data => {
            if (data.data.error) {          //if the backend throws an error, put it into the state
                setError(data.data.error)
            } else {                        //if no error, set set the product state
                setProductsBySold(data.data)
            }
        })
    }

    const getProductsByArrival = () => {
        getProducts('createdAt')
        .then(data => {
            if (data.data.error) {          //if the backend throws an error, put it into the state
                setError(data.data.error)
            } else {                        //if no error, set the product state
                setProductsByArrival(data.data)
            }
        })
    }

    useEffect(() => {
        getProductsByArrival()
        getProductsBySold()
    }, [])

    return (
        <Layout 
        title='Home Page'
        description='MERN E-commerce App'
        >
            <h3 className="productCategoryHeader">New Arrivals</h3>
            <img src={Transition} alt="transition graphic" className="landingImage"></img>
            <div className='productCardWrapper'>
                {productsByArrival.map((product, index) => (
                    <ProductCard key={index} product={product}/>
                ))}
            </div>
            <img src={Transition} alt="transition graphic" className="landingImageFlip"></img>
            <h3 className="productCategoryHeader">Top Sellers</h3>
            <img src={Transition} alt="transition graphic" className="landingImage"></img>
            <div className='productCardWrapper'>
                {productsBySold.map((product, index) => (
                    <ProductCard key={index} product={product}/>
                ))}
            </div>
        </Layout>
    )
}

export default Landing