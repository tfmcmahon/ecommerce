import React, { useState } from 'react'
import { Link, Redirect } from 'react-router-dom'
import { addItemToCart, updateCartItem, removeCartItem } from '../../actions/cartActions'

import ProductImage from '../product/ImageComponent'

const ProductCard = ({ 
    product, 
    showAddToCartButton = true, 
    cartUpdate = false,
    cartRemove = false,
    setRun = f => f,
    run = undefined
}) => {
    const [redirect, setRedirect] = useState(false)
    const [count, setCount] = useState(product.count)

    const addToCart = () => {
        addItemToCart(product, () => {
            //callback function after something is added to the cart (redirect the user to the cart page)
            setRedirect(true)
        })
    }

    const shouldRedirect = redirect => {
        if (redirect) {
            return (
                <Redirect to='/cart'/>
            )
        }
    }

    const cartButton = showAddToCartButton => {
        return (
            showAddToCartButton && 
            <button
                onClick={addToCart}
                className="cartButton"
            >
                Add to Cart
            </button>
        )
    }

    const handleChange = productId => event => {
        setRun(!run); // run useEffect in parent Cart
        let { value } = event.target
        setCount(
            value < 1 
                ? 1     //prevent values below 1
                : value
            ) 
        if (value >= 1) {
            updateCartItem(productId, value)
        }
    }

    const showCartUpdateOptions = cartUpdate => {
        return (
            cartUpdate &&
            <div className='cartIncrementWrapper'>
                <span className='incrementSpan'>Quantity</span>
                    <input 
                        type='number'
                        className='incrementInput'
                        value={count}
                        onChange={handleChange(product._id)}
                    />
            </div>
        )
    }

    const showRemoveFromCart = cartRemove => {
        return (
            cartRemove && 
            <button
                onClick={() => {
                    removeCartItem(product._id)
                    setRun(!run)                
                }}
                className="navButton"
            >
                Remove
            </button>
        )
    }

    return (
        <div className='productCard'>
            <div className='productCardHeader'>{product.name}</div>
            <div className='productCardUnderHeader'>
                {shouldRedirect(redirect)}
                <ProductImage item={product} url='product' />
                <div className='horizontalRuleProduct'></div>
                <div className='productCardInfo'>
                    <p className='productText'>
                        {product.description}
                    </p>
                </div>
                <div className='productButtonRow'>
                    <div className='productCardPrice'>
                        ${product.price}
                    </div>
                    <Link to={`/product/${product._id}`}>
                        <button
                            className="productButton"
                        >
                            View Poster
                        </button>
                    </Link>
                    {cartButton(showAddToCartButton)}
                    {showRemoveFromCart(cartRemove)}
                </div>
                {showCartUpdateOptions(cartUpdate)}
            </div>
        </div>
    )
}

export default ProductCard