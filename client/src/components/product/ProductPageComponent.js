import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../layout/LayoutComponent'
import { getSingleProduct, getRelatedProducts } from '../../actions/productActions'
import ProductCard from './ProductCardComponent'
import LargeProductImage from './LargeImageComponent'
import moment from 'moment'
import Transition from '../../images/transition1.svg'


const ProductPage = (props) => {
    const [product, setProduct] = useState({})
    const [relatedProducts, setRelatedProducts] = useState([])
    const [error, setError] = useState('')

    useEffect(() => {
        //get product id from the URL (router dom allows this)
        const productId = props.match.params.productId
        getSingleProduct(productId)
            .then(data => {
                if (data.data.error) {
                    setError(data.data.error)
                } else {
                    setProduct(data.data)
                    //get related products based on data
                    getRelatedProducts(data.data._id)
                        .then(related => {
                            if (related.data.error) {
                                console.log(error)
                                setError(related.data.error)
                            } else {
                                setRelatedProducts(related.data)
                            }
                        })
                }
            })
    }, [props])

    const addToCartButton = () => (
        <div className='productButtonRow'>
        <Link to='/'>
            <button
                className="productButton"
            >
                Add to Cart
            </button>
        </Link>
    </div>
    )

    const showStock = quantity => {
        return (
            quantity > 0 
                ? <span className='inStockText'>In stock</span> 
                : <span className='outOfStockText'>Out of stock</span>
            )
    }

    return (
        <Layout 
        title='Product Page'
        description='MERN E-commerce App'
        >
            <div className='productPageWrapper'>
                <div className='productPageCard'>
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
                            <p className='productPagePrice'>
                                ${product.price}
                            </p>
                            <p className='productPageCategory'>
                                Category: {product.category && product.category.name}
                            </p>
                            <p className='productPageCategory'>
                                Added {moment(product.createdAt).fromNow()}
                            </p>
                            {showStock(product.quantity)}
                        </div>

                        {addToCartButton()}
                    </div>
                </div>
            </div>
            <img src={Transition} alt="transition graphic" className="landingImage"></img>
            <div className='sectionWrapper'>
                <h3 className='productCategoryHeader'>Related Products</h3>
                <div className='relatedProductsWrapper'>
                    {relatedProducts.map((product, index) => (
                        <ProductCard key={index} product={product}/>
                    ))}
                </div>
            </div>
        </Layout>
    )
}

export default ProductPage