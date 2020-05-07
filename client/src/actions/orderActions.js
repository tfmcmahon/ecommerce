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

export const createOrder = (userId, token, orderData) => {
    options.url = `/api/order/create/${userId}`
    options.method = 'POST'
    options.data = ({ order: orderData })
    options.headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    }
    return axios(options)
            .then(response => {
                return response
            })
            .catch(err => {
                return err.response
            })
}

export const listOrders = (userId, token) => {
    options.url = `/api/orders/list/${userId}`
    options.method = 'GET'
    options.headers = {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
    }
    return axios(options)
            .then(response => {
                return response
            })
            .catch(err => {
                return err.response
            })
}

export const getOrderStatus = (userId, token) => {
    options.url = `/api/orders/status/${userId}`
    options.method = 'GET'
    options.headers = {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
    }
    return axios(options)
            .then(response => {
                return response
            })
            .catch(err => {
                return err.response
            })
}


export const updateOrderStatus = (orderId, userId, status, token) => {
    options.url = `/api/orders/${orderId}/status/${userId}`
    options.method = 'PUT'
    options.data = { orderId, status }
    options.headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    }
    return axios(options)
            .then(response => {
                return response
            })
            .catch(err => {
                return err.response
            })
}