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

export const createCategory = (userId, token, category) => {
    options.url = `/api/category/create/${userId}`
    options.method = 'POST'
    options.data = JSON.stringify(category)
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

export const getCategories = () => {
    options.url = `/api/categories/all`
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