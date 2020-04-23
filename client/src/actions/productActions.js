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

/* 
 *perform CRUD on products 
 *create a product          C
 *get a single product      R
 *update a single product   U
 *delete a single product   D
 */

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

export const updateProduct = (productId, userId, token, product) => {
    options.url = `${API}/product/${productId}/${userId}`
    options.method = 'PUT'
    options.headers = {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Content-Type': `multipart/form-data; boundary=${product._boundary}`
    }
    options.data = product
    return axios(options)
            .then(response => {
                return response
            })
            .catch(err => {
                return err.response
            })
}

export const deleteProduct = (productId, userId, token) => {
    options.url = `${API}/product/${productId}/${userId}`
    options.method = 'DELETE'
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

export const getAllProducts = sortBy => {
    options.url = `${API}/products?sortBy=${sortBy}&order=desc&limit=undefined`
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

export const getFilteredProducts = (skip = 0, limit = 6, filters = {}) => { //det defaults for useEffect
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

