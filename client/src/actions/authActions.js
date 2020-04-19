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

export const register = user => {
    options.url = `${API}/register`
    options.method = 'POST'
    options.data = user

    return axios(options)
            .then(response => {
                return response
            })
            .catch(err => {
                console.log('register method', err.response)
                return err.response
            })
}

export const login = user => {
    options.url = `${API}/login`
    options.method = 'POST'
    options.data = user
    
    return axios(options)
            .then(response => {
                return response
            })
            .catch(err => {
                return err.response
            })
}

export const authenticate = (data, next) => {
    //put the web token into local storage
    if (typeof window !== 'undefined') {
        localStorage.setItem('jwt', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
    }
    next()
}

export const isAuthenticated = () => {
    if (typeof window == 'undefined') {
        return false
    }
    if (localStorage.getItem('jwt')) {
        return localStorage.getItem('jwt')
    } else {
        return false
    }
}

export const getUser = () => {
    if (localStorage.getItem('jwt')) {
        return JSON.parse(localStorage.getItem('user'))
    } else {
        return false
    }
}

export const logout = next => {
    //remove the token from local storage
    if (typeof window !== 'undefined') {
        localStorage.removeItem('jwt')
        localStorage.removeItem('user')
        next()
        options.url = `${API}/logout`
        options.method = 'GET'
        options.headers = ''
        return axios(options)
                .then(response => {
                    console.log('logout', response)
                })
                .catch(err => console.log(err.response))
    }
}