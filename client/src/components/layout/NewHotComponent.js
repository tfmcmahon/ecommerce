import React, { useState, useEffect } from 'react'
import Layout from './LayoutComponent'
import { getProducts } from '../../actions/productActions'
import ProductCard from '../product/ProductCardComponent'
import SearchBar from './SearchComponent'

const NewHot = () => {
    //state setup
    const [productsBySold, setProductsBySold] = useState([])
    const [productsByArrival, setProductsByArrival] = useState([])


    useEffect(() => {
        //product sort methods -- call on mount
        getProducts('createdAt')
        .then(data => {
            if (data.data.error) {          
                console.log(data.data.error)
            } else {                        //if no error, set the product state
                setProductsByArrival(data.data)
            }
        })
        getProducts('sold')
        .then(data => {
            if (data.data.error) {          
                console.log(data.data.error)
            } else {                        //if no error, set set the product state
                setProductsBySold(data.data)
            }
        })
    }, [])

    return (
        <Layout 
        title='Search'
        description='Search the shop or view by top and new'
        >
            <SearchBar />
            <div className='horizontalRule'></div>
            <div className='sectionWrapper'>
                <h3 className="productCategoryHeader">New Arrivals</h3>
                <div className='productCardWrapper'>
                    {productsByArrival.map((product, index) => (
                        <ProductCard key={index} product={product}/>
                    ))}
                </div>
            </div>
                <div className='horizontalRule'></div>
            <div className='sectionWrapper'>
                <h3 className="productCategoryHeader">Top Sellers</h3>
                <div className='productCardWrapper'>
                    {productsBySold.map((product, index) => (
                        <ProductCard key={index} product={product}/>
                    ))}
                </div>
            </div>
        </Layout>
    )
}

export default NewHot