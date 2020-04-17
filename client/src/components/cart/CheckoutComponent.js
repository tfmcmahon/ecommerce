import React from 'react'
import { Link } from 'react-router-dom'
import { isAuthenticated } from '../../actions/authActions'

const Checkout = ({ products }) => {

    const getCheckoutTotal = () => {
        return (
            products.reduce((currentValue, nextValue) => {
                return currentValue 
                + nextValue.count   //add the next item ...
                * nextValue.price   //multiplied by its price ()
            }, 0)                   //start with a total of 0
            .toFixed(2)             //trim extra decimals
        )
    }

    const showCheckout = () => (
        <div className='checkoutCard'>
            <h3 className='productCategoryHeader'>Total: ${getCheckoutTotal()}</h3>
            {isAuthenticated() 
            ? <button className='searchButton'>Checkout</button> 
            : <Link to='/login'>
                <button className='searchButton'>
                    Login to Checkout
                </button>
            </Link>
            }
        </div>
    )

    return (
        <div>
            {showCheckout()}
        </div>
    )
}

export default Checkout