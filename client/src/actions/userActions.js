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

export const readUser = (userId, token) => {
    options.url = `/api/user/${userId}`
    options.method = 'GET'
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

export const updateUser = (userId, token, userData) => {
    options.url = `/api/user/${userId}`
    options.method = 'PUT'
    options.data = userData
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

//we need to update the local storage so that the user doesn't need to refresh to see changes
export const updateUserLocal = (userData, next) => {
    //put the web token into local storage
    if (typeof window !== 'undefined') {
        if (localStorage.getItem('jwt')) {
            let auth = localStorage.getItem('jwt')
            let user = localStorage.getItem('user')
            user = userData
            localStorage.setItem('jwt', auth)
            localStorage.setItem('user', JSON.stringify(user.data))
            next()
        }
    }
}

export const getOrderHistory = (userId, token) => {
    options.url = `/api/user/orders/${userId}`
    options.method = 'GET'
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