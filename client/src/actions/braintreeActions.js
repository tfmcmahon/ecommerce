import axios from 'axios'

let options = {
    url: '',
    method: '',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json' 
    },
    data: ''
}


export const getBraintreeClientToken = (userId, token) => {
    options.url = `/api/braintree/getToken/${userId}`
    options.method = 'GET'
    options.headers = {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json' 
    }
    return axios(options)
            .then(response => {
                return response
            })
            .catch(err => {
                return err.response
            })
}

export const processPayment = (userId, token, paymentData) => {
    options.url = `/api/braintree/payment/${userId}`
    options.method = 'POST'
    options.data = paymentData
    options.headers = {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json' 
    }
    return axios(options)
            .then(response => {
                return response
            })
            .catch(err => {
                return err.response
            })
}