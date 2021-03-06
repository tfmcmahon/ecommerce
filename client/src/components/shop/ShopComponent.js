import React, { useState, useEffect } from 'react'
import { getCategories } from '../../actions/categoryActions'
import { getFilteredProducts } from '../../actions/productActions'
import ProductCard from '../product/ProductCardComponent'
import Layout from '../layout/LayoutComponent'
import CategoryFilter from './CategoryFilterComponent'
import PriceFilter from './PriceFilterComponent'
import { prices } from '../../config/prices'


const Shop = () => {
    //state setup
    const [userFilters, setUserFilters] = useState({
        filters: {
            category: [],
            price: []
        }
    })
    const [categories, setCategories] = useState([])
    const [skip, setSkip] = useState(0)
    const [size, setSize] = useState(0)
    const [filteredResults, setFilteredResults] = useState([])
    const limit = 6 //results per page

    //load categories and set form data
    useEffect(() => {
        getCategories()
            .then(data => {
                if (data.data.error) {          //if the backend throws an error, put it into the state
                    console.log(data.data.error)
                } else {                        //if no error, set categories
                    setCategories(data.data.data)
                }
            })

        getFilteredProducts()
            .then(data => {
                if (data.data.error) {
                    console.log(data.data.error)
                } else {
                    setFilteredResults(data.data.products)
                    setSize(data.data.size)
                }
            })                  
    }, [])
    
    const getFilteredResults = sentFilters => {
        getFilteredProducts(0, limit, sentFilters)          // 0 = reset skip value when selecting a filter
            .then(data => {
                if (data.data.error) {
                    console.log(data.data.error)
                } else {
                    setFilteredResults(data.data.products)
                    setSize(data.data.size)
                    setSkip(0)
                }
            })
    }

    const getMore = () => {
        let skipTo = skip + limit
        getFilteredProducts(skipTo, limit, userFilters.filters)
            .then(data => {
                if (data.data.error) {
                    console.log(data.data.error)
                } else {
                    setFilteredResults([...filteredResults, ...data.data.products])
                    setSize(data.data.size)
                    setSkip(skipTo)
                }
            })
    }

    const getMoreButton = () => {
        return (
            size > 0 && size >= limit && (
                <button onClick={getMore} className='productButton'>
                    Load more
                </button>
            )
        )
    }

    const handleFilters = (filters, filterBy) => {
        const newFilters = { ...userFilters }       //store the user filters state onto a proxy
        newFilters.filters[filterBy] = filters      //update the proxy filters by category

        if (filterBy === 'price') {
            let priceValues = handlePrice(filters)
            newFilters.filters[filterBy] = priceValues 
        }
        getFilteredResults(userFilters.filters)
        setUserFilters(newFilters)                  //write over the state with the proxy
    }

    const handlePrice = value => {
        //get price arrays from the price config file to send to the DB (instead of id)
        let data = prices
        let priceArray = []

        for (let key in data) {
            if(data[key]._id === parseInt(value)) { //find the matching key in the prices object
                priceArray = data[key].array        //set our variable to the number range array from the object
            }
        }
        return priceArray                           //return the number range array
    }

    return (
        <Layout
            title='Shop'
            description='use the filters to browse the poster shop'
        >
            <div className='shopWrapper'>
                <div className='leftSideBarWrapper'>
                    <div className='stickyFilters'>
                        <h3 className='filterCategoryHeader'>Category</h3>
                        <ul className='checkboxList'>
                            <CategoryFilter 
                                categories={categories} 
                                handleFilters={filters => handleFilters(filters, 'category')}
                            />
                        </ul>
                        <div className='horizontalRule'></div>
                        <h3 className='filterCategoryHeader'>Price</h3>
                        <ul className='radioList'>
                            <PriceFilter 
                                prices={prices} 
                                handleFilters={filters => handleFilters(filters, 'price')}
                            />
                        </ul>
                    </div>
                </div>
                <div className='verticalRuleShop'></div>
                <div className='shopDisplayWrapper'>
                    <div className='productCardWrapper'>
                        { filteredResults.map((product, index) => (
                            <ProductCard key={index} product={product}/>
                        )) }
                    </div>
                    <div className='horizontalRuleShop'></div>
                    <div className='getMoreWrapper'>
                        {getMoreButton()}
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default Shop