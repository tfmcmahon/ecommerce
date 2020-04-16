import React, { useState, useEffect, Fragment } from 'react'
import Layout from './LayoutComponent'
import { getSearchedProducts } from '../../actions/productActions'
import { getCategories } from '../../actions/categoryActions'
import ProductCard from '../product/ProductCardComponent'

const SearchBar = () => {
    const [values, setValues] = useState({
        categories: [],
        category: '',
        search: '',
        results: [],
        searched: false                 //this is so we can display 'product not found' if necessary
    })

    const { 
        categories,
        category,
        search,
        results,
        searched
     } = values

    useEffect(() => {
        getCategories()
        .then(data => {
            if (data.data.error) {
                console.log(data.data.error)
            } else {
                setValues({
                    ...values,
                    categories: data.data.data
                })
            }
        }) 
    }, [])

    const searchData = () => {
        if (search) {
            getSearchedProducts({
                search: search || undefined,
                category: category
            })
                .then(data => {
                    if (data.data.error) {
                        console.log(data.data.error)
                    } else {
                        console.log(data.data)
                        setValues({
                            ...values,
                            results: data.data,
                            searched: true
                        })
                    }
                })
        }
    }

    const searchSubmit = event => {
        event.preventDefault()
        searchData()
    }

    const handleChange = () => event => {
        let { name, value } = event.target
        setValues({
            ...values,
            searched: false,
            [name]: value
        })
    }

    const showSearchedProducts = (results = []) => { //set default value of nothing for component mount
        return (
            <div className='whiteCardWrapper'>
                {results.map((product, index) => (
                    <ProductCard key={index} product={product}/>
                ))}
            </div>
        )
    }

    const searchMessage = (searched, results) => {
        if (searched && results.length > 1) {
            return (
                <Fragment>
                    <h3 className="productCategoryHeaderWhite">
                        Search results
                    </h3>
                    <p className="productCategoryDisplayWhite">
                        Showing {results.length} products
                    </p>
                </Fragment>
                )
        }
        if (searched && results.length == 1) {
            return (
                <Fragment>
                    <h3 className="productCategoryHeaderWhite">
                        Search results
                    </h3>
                    <p className="productCategoryDisplayWhite">
                        Showing 1 product
                    </p>
                </Fragment>
            )
        }
        if (searched && results.length < 1) {
            return (
                <p className="productCategoryDisplayWhite">
                    No products found.
                </p>
            )
        }
    }

    const searchForm = () => (
        <form onSubmit={searchSubmit} className='searchForm'>
            <span className='searchSpan'>
                <div className='searchInputWrapper'>
                    <div className='searchSelectWrapper'>
                        <select className='searchSelect' onChange={handleChange()} name='category'>
                            <option value='All' className='searchDropdown'>Category</option>
                            {categories.map((category, index) => (
                                <option key={index} value={category._id} className='searchDropdown'>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className='verticalRuleSmall'></div>
                    <input 
                        className='searchInput' 
                        type='search'
                        name='search'
                        onChange={handleChange()}
                        placeholder='Search Products'
                    />
                </div>
                <button className='searchButton'>
                    Search
                </button>
            </span>
        </form>
    )

    return (
        <div>
            <div className='searchFormWrapper'>
                {searchForm()}
            </div>
            {searchMessage(searched, results)}
            {showSearchedProducts(results)}
        </div>
    )
}

export default SearchBar