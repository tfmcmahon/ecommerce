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

export const getProducts = (sortBy) => {
    options.url = `${API}/products?sortBy=${sortBy}&order=desc&limit=6`
    options.method = 'GET'
    options.headers = ''
    return axios(options)
            .then(response => {
                console.log(response)
                return response
            })
            .catch(err => {
                return err.response
            })
}