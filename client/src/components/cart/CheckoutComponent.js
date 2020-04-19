import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { emptyCart } from '../../actions/cartActions'
import { isAuthenticated, getUser } from '../../actions/authActions'
import { getBraintreeClientToken, processPayment } from '../../actions/braintreeActions'
import DropIn from 'braintree-web-drop-in-react'

const Checkout = ({
    products,
    setRun = f => f,
    run = undefined
}) => {
    const [values, setValues] = useState({
        loading: false,
        success: false,
        clientToken: null,
        error: '',
        instance: {},               //for braintree web drop in
        address: ''
    })

    const userId = getUser() && getUser()._id
    const token = isAuthenticated()

    useEffect(() => {
        getBraintreeClientToken(userId, token)
            .then(data => {
                if (data.data.error) {
                    setValues({
                        ...values,
                        error: data.error
                    })
                } else {
                    setValues({
                        ...values,
                        clientToken: data.data.clientToken
                    })
                }
            })
    }, [])

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

    const sendPayment = () => {
        setValues({
            ...values,
            loading: true
        })
        //Send nonce to server
        //nonce = values.instance.requestPaymentMethod()
        let nonce
        let getNonce = values.instance.requestPaymentMethod()
            .then(data => {
                nonce = data.nonce
                //once we have the nonce (card type, card number, etc)
                //send it as paymentMethodNonce to the backend and the shop total to be charged
                const paymentData = {
                    paymentMethodNonce: nonce,
                    amount: getCheckoutTotal()
                }
                processPayment(userId, token, paymentData)
                    .then(response => {
                        setValues({
                            ...values,
                            success: true,
                            loading: false
                        })
                        emptyCart(() => {
                            console.log('cart emptied')
                            setRun(!run); // run useEffect in parent Component
                        })
                        //create order
                    })
                    .catch(error => {
                        console.log(error)
                        setValues({
                            ...values,
                            loading: false
                        })
                    })
            })
            .catch(error => {
                setValues({
                    ...values,
                    error: error.message
                })
            })
    }

    const showServerMessage = () => (
        <div className='errorWrapperPayment'>
            <div className='errorWrapper'>
                <p 
                    className='errorText'
                    style={{ display: values.error ? '' : 'none' }}
                >
                    {values.error}
                </p>
                <p 
                    className='successText'
                    style={{ display: values.success ? '' : 'none' }}
                >
                    Payment processed successfully!
                </p>
            </div>
        </div>
    )

    const showDropIn = () => (
        <div 
            className='dropInWrapperOuter'
            onBlur={() => { //clear errors whenver user interacts with the page
                setValues({
                    ...values,
                    error: ''
                })
            }}
        >
            {values.clientToken !== null && products.length > 0 //check that we have a client token and that there are items in the cart
                ? <div className='dropInWrapperInner'>
                    <div className='payButtonWrapper'>
                        <DropIn 
                            options={{ 
                                authorization: values.clientToken,
                                paypal: {
                                    flow: 'vault'
                                }
                            }}
                            onInstance={instance => (values.instance = instance)}
                            />
                    </div>
                        <button 
                            className='payButton'
                            onClick={sendPayment}
                        >
                            Pay
                        </button>
                  </div>
                : null                                          //if no client token and no cart items, don't display
            }
        </div>
    )

    const showCheckout = () => (
        <div className='checkoutCard'>
            <h3 className='checkoutTotal'>Total: ${getCheckoutTotal()}</h3>
            {isAuthenticated() 
            ? showDropIn()
            : <Link to='/login'>
                <button className='searchButton'>
                    Login to Checkout
                </button>
            </Link>
            }
        </div>
    )

    const showLoading = () => (
        values.loading && 
        <div className="loadingWrapper">
            <div className="loading"></div>
        </div>
    )

    return (
        <div>
            {showCheckout()}
            {showServerMessage()}
            {showLoading()}
        </div>
    )
}

export default Checkout