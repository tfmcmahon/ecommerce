import React, { useEffect, useState, Fragment } from 'react'
import { Redirect } from 'react-router-dom'
import Layout from '../layout/LayoutComponent'
import { getSingleProduct, getRelatedProducts } from '../../actions/productActions'
import { addItemToCart } from '../../actions/cartActions'
import ProductCard from './ProductCardComponent'
import LargeProductImage from './LargeImageComponent'
import moment from 'moment'

const ProductPage = (props) => {
    const [product, setProduct] = useState({})
    const [relatedProducts, setRelatedProducts] = useState([])
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(true)
    const [redirect, setRedirect] = useState(false)

    useEffect(() => {
        //get product id from the URL (router dom allows this)
        const productId = props.match.params.productId
        getSingleProduct(productId)
            .then(data => {
                setLoading(true)
                if (data.data.error) {
                    setError(data.data.error)
                } else {
                    setProduct(data.data)
                    //get related products based on data
                    getRelatedProducts(data.data._id)
                        .then(related => {
                            if (related.data.error) {
                                setLoading(false)
                                setError(related.data.error)
                            } else {
                                setLoading(false)
                                setRelatedProducts(related.data)
                            }
                        })
                }
            })
    }, [props, error])

    const addToCart = () => {
        addItemToCart(product, () => {
            //callback function after something is added to the cart (redirect the user to the cart page)
            setRedirect(true)
        })
    }

    const cartButton = () => {
        return (
            <button
                onClick={addToCart}
                className="cartButton"
            >
                Add to Cart
            </button>
        )
    }


    const showStock = quantity => {
        return (
            quantity > 0 
                ? <span className='inStockText'>In stock</span> 
                : <span className='outOfStockText'>Out of stock</span>
            )
    }

    const showLoading = loading => (
        loading && 
        <div className="loadingWrapper">
            <div className="loading"></div>
        </div>
    )

    const shouldRedirect = redirect => {
        if (redirect) {
            return (
                <Redirect to='/cart'/>
            )
        }
    }

    return (
        <Layout 
        title='Poster Page'
        description='View poster information and related posters'
        >
        {loading
        ? showLoading(loading)
        :   <Fragment>
                <div className='productPageWrapper'>
                    <div className='productPageCard'>
                        {shouldRedirect(redirect)}
                        <div className='productPageHeader'>{product.name}</div>
                        <div className='productPageUnderHeader'>
                            <LargeProductImage item={product} url='product' />
                            <div className='horizontalRuleProduct'></div>
                            <div className='productPageInfo'>
                                <p className='productPageText'>
                                    {product.description}
                                </p>
                            </div>
                            <div className='horizontalRuleProduct'></div>
                            <div className='productPageExtras'>
                                <p className='productPageCategory'>
                                    Category: {product.category && product.category.name}
                                </p>
                                <p className='productPageCategory'>
                                    Added {moment(product.createdAt).fromNow()}
                                </p>
                                {showStock(product.quantity)}
                            </div>
                            <div className='productButtonRow'>
                                <div className='productPagePrice'>
                                    ${product.price}
                                </div>
                                {cartButton()}
                            </div>
                        </div>
                    </div>
                </div>
                <div className='horizontalRule'></div>
                <div className='sectionWrapper'>
                    <h3 className='productCategoryHeader'>Related Posters</h3>
                    <div className='relatedProductsWrapper'>
                        {relatedProducts.map((product, index) => (
                            <ProductCard key={index} product={product}/>
                        ))}
                    </div>
                </div>
            </Fragment>
            }
        </Layout>
    )
}

export default ProductPage