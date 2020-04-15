import React, { useState, useEffect } from 'react'
import Layout from '../layout/LayoutComponent'
import { getCategories } from '../../actions/categoryActions'
import ProductCard from '../product/ProductCardComponent'
import Checkbox from './CheckboxComponent'
import Transition from '../../images/transition1.svg'

const Shop = () => {
    //state setup
    const [categories, setCategories] = useState([])
    const [error, setError] = useState('')

    //load categories and set form data
    useEffect(() => {
        getCategories()
            .then(data => {
                if (data.data.error) {          //if the backend throws an error, put it into the state
                    setError(data.data.error)
                } else {                        //if no error, set categories
                    setCategories(data.data.data)
                }
            })
    }, [])

    return (
        <Layout 
        title='Shop Page'
        description='MERN E-commerce App'
        >
            <div className='shopWrapper'>
                <div className='leftSideBarWrapper'>
                    <h3 className='filterCategoryHeader'>Filter by Category</h3>
                    <ul className='checkboxList'>
                        <Checkbox categories={categories} />
                    </ul>
                </div>
                <div className='shopDisplayWrapper'>
                    shop display
                </div>
            </div>
        </Layout>
    )
}

export default Shop