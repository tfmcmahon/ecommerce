import axios from 'axios'
import { API } from '../config/config'


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
    options.url = `${API}/order/create/${userId}`
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
    options.url = `${API}/orders/list/${userId}`
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
    options.url = `${API}/orders/status/${userId}`
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
    options.url = `${API}/orders/${orderId}/status/${userId}`
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