import React from 'react'
import { Link } from 'react-router-dom'

import ProductImage from '../product/ImageComponent'

const ProductCard = ({product}) => {
    return (
        <div className='productCard'>
            <div className='productCardHeader'>{product.name}</div>
            <div className='productCardUnderHeader'>
                <ProductImage item={product} url='product' />
                <div className='horizontalRuleProduct'></div>
                <div className='productCardInfo'>
                    <p className='productText'>
                        {product.description.substring(0, 100)}
                    </p>
                </div>
                <div className='horizontalRuleProduct'></div>
                <div className='productCardPrice'>
                    ${product.price}
                </div>
                <div className='productButtonRow'>
                    <Link to={`/product/${product._id}`}>
                        <button
                            className="productButton"
                        >
                            View Product
                        </button>
                    </Link>
                    <Link to='/'>
                        <button
                            className="productButton"
                        >
                            Add to Cart
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default ProductCard