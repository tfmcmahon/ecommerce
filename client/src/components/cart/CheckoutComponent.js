import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { emptyCart } from '../../actions/cartActions'
import { createOrder } from '../../actions/orderActions'
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
        addressSuccess: false,
        clientToken: null,
        addressError: '',
        instance: {},               //for braintree web drop in
    })
    const [address, setAddress] = useState({
        address1: '',
        address2: '',
        city: '',
        state: '',
        zip: ''
    })
    const [error, setError] = useState('')
    const userId = getUser()._id
    const token = isAuthenticated()

    useEffect(() => {
        getBraintreeClientToken(userId, token)
            .then(data => {
                if (data.data.error) {
                    setError(data.error)
                } else {
                    setValues({
                        clientToken: data.data.clientToken
                    })
                }
            })
    }, [userId, token])

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

    const validateAddress = event => {
        event.preventDefault()
        if (!address.city) {
            setValues({
                ...values,
                addressError: 'Address Line 1 is required'
            })
        } else if (!address.state) {
            setValues({
                ...values,
                addressError: 'State is required'
            })
        } else if (!address.zip || address.zip.length !== 5) {
            setValues({
                ...values,
                addressError: 'Zip Code must be 5 digits'
            })
        } else if (!address.address1) {
            setValues({
                ...values,
                addressError: 'City is required'
            })
        } else {
            setValues({
                ...values,
                addressSuccess: true
            })
        }
    }

    const sendPayment = () => {
        //Validate address
        if (!values.addressSuccess) {
            setError('Please fill out the shipping fields')
        } else {
            setValues({
                ...values,
                loading: true
            })
            //Send nonce to server
            //nonce = values.instance.requestPaymentMethod()
            let nonce
            values.instance.requestPaymentMethod()
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
                            //store the order data in an object
                            const orderData = {
                                products: products,
                                transactionId: response.data.transaction.id,
                                amount: response.data.transaction.amount,
                                address: address
                            }
                            //send the order data to the backend
                            createOrder(userId, token, orderData)
                                .then(response => {
                                    emptyCart(() => {
                                        setRun(!run); // run useEffect in parent Component so that the emptied cart updates
                                        setValues({
                                            ...values,
                                            success: true,
                                            loading: false
                                        })
                                    })
                                }).catch(error => {
                                    console.log(error)
                                    setValues({
                                        ...values,
                                        loading: false
                                    })
                                })
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
                        loading: false,
                        error: error.message
                    })
                })
        }
    }

    const showServerMessage = () => (
        <div className='errorWrapperPayment'>
            <div className='errorWrapper'>
                <p 
                    className='errorText'
                    style={{ display: error ? '' : 'none' }}
                >
                    {error}
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

    const addressMessage = () => (
        <div className='errorWrapperPayment'>
            <div className='errorWrapper'>
                <p 
                    className='errorText'
                    style={{ display: values.addressError ? '' : 'none' }}
                >
                    {values.addressError}
                </p>
                <p 
                    className='successText'
                    style={{ display: values.addressSuccess ? '' : 'none' }}
                >
                    Address accepted!
                </p>
            </div>
        </div>
    )

    const handleAddress = () => event => {
        let { name, value } = event.target
        setAddress({
            ...address,
            [name]: value
        })
    }

    const addressForm = () => (
        values.clientToken !== null && products.length > 0 
            ? 
        <div className='addressAllWrapper'
            onBlur={() => { //clear address errors whenver user interacts with the page
                setValues({
                    ...values,
                    addressError: ''
                })
            }}
        >
            <div className='addressWrapper'>
            <p className='pageDescriptionAddress'>Shipping Address</p>
                <form 
                noValidate 
                className="loginFormHelp" 
                >
                    <input 
                        onChange={handleAddress()}
                        type="text"
                        name="address1"
                        placeholder="Address Line 1*" 
                        className="submitUsername"
                        value={address.address1}
                    />
                    <br />
                    <input
                        onChange={handleAddress()}
                        type="text" 
                        name="address2"
                        placeholder="Address Line 2" 
                        className="submitUsername"
                        value={address.address2}
                    />
                    <br />
                    <input
                        onChange={handleAddress()}
                        type="text" 
                        name="city" 
                        placeholder="City*" 
                        className="submitUsername"
                        value={address.city}
                    />
                    <br />
                    <input
                        onChange={handleAddress()}
                        type="text" 
                        name="state" 
                        placeholder="State*" 
                        className="submitUsername"
                        value={address.state}
                    />
                    <br />
                    <input
                        onChange={handleAddress()}
                        type="number" 
                        name="zip" 
                        placeholder="Zip Code*" 
                        className="submitUsername"
                        value={address.zip}
                    />
                </form>
            </div>
            {addressMessage()}
                <button 
                    className='payButton'
                    onClick={validateAddress}
                >
                    Submit
                </button>
        </div>
        : null
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
        <div>
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
        <div className='checkoutCard'>
            <h3 className='checkoutTotal'>Total: ${getCheckoutTotal()}</h3>
            {addressForm()}
            {showCheckout()}
            {showServerMessage()}
            {showLoading()}
        </div>
    )
}

export default Checkout