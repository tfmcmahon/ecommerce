import axios from 'axios'
import { API } from '../config/config'
import queryString from 'query-string'

let options = {
    url: '',
    method: '',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json' 
    },
    data: ''
}

export const createProduct = (userId, token, product) => {
    options.url = `${API}/product/create/${userId}`
    options.method = 'POST'
    options.data = product
    options.headers = {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Content-Type': `multipart/form-data; boundary=${product._boundary}`
    }
    return axios(options)
            .then(response => {
                return response
            })
            .catch(err => {
                return err.response
            })
}

export const getProducts = sortBy => {
    options.url = `${API}/products?sortBy=${sortBy}&order=desc&limit=6`
    options.method = 'GET'
    options.headers = ''
    return axios(options)
            .then(response => {
                return response
            })
            .catch(err => {
                return err.response
            })
}

export const getFilteredProducts = (skip, limit, filters = {}) => {
    const data = {
        limit,
        skip,
        filters
    }
    options.url = `${API}/products/search`
    options.method = 'POST'
    options.data = JSON.stringify(data)
    options.headers = {
        'Accept': 'application/json',
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

export const getSearchedProducts = searchData => {
    const query = queryString.stringify(searchData)
    options.url = `${API}/products/user/search?${query}`
    options.method = 'GET'
    options.headers = ''
    return axios(options)
            .then(response => {
                return response
            })
            .catch(err => {
                return err.response
            })
}

export const getSingleProduct = productId => {
    options.url = `${API}/product/${productId}`
    options.method = 'GET'
    options.headers = ''
    return axios(options)
            .then(response => {
                return response
            })
            .catch(err => {
                return err.response
            })
}

export const getRelatedProducts = productId => {
    options.url = `${API}/products/related/${productId}`
    options.method = 'GET'
    options.headers = ''
    return axios(options)
            .then(response => {
                return response
            })
            .catch(err => {
                return err.response
            })
}