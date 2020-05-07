const { register, login, logout, requireLogin, isAuth, isAdmin } = require('../../controllers/authController')
const EcommerceUser = require('../../models/userModel')
const httpMocks = require('node-mocks-http')
const newUser = require('../mockData/newUser.json')
const jwt = require('jsonwebtoken')

expressJwt = jest.fn()
jest.mock('../../models/userModel') 
jest.mock('jsonwebtoken')

let req, res, next, id, token
beforeEach(() => {
    req = httpMocks.createRequest()
    res = httpMocks.createResponse()
    next = jest.fn()
    id = '5ea4925ed1b1d982e03c7bd4' //faux ID
    token = 'xxxxx.yyyyy.zzzzz'
})

describe('authController.isAdmin', () => {

    beforeEach(() => {
        req.profile = newUser
    })

    it('should be a function', () => {
        expect(typeof isAdmin).toBe('function')
    })

    it('should call next if the attached profile has a role of 1', () => {
        req.profile.role = 1
        isAdmin(req, res, next)
        expect(next).toBeCalled()
    })

    it('should return a status code of 403 and an error json if the user`s role is 0', () => {
        req.profile.role = 0
        isAdmin(req, res, next)
        expect(res.statusCode).toBe(403)
        expect(res._isEndCalled()).toBeTruthy()
        expect(res._getJSONData()).toStrictEqual({ error: "This area is for administrators only." })
    })

})

describe('authController.isAuth', () => {

    beforeEach(() => {
        req.profile = newUser
        req.profile._id = id
        req.auth = {
            token,
            _id: id
        }
    })

    it('should be a function', () => {
        expect(typeof isAuth).toBe('function')
    })

    it('should check for profile, auth, and compare their ids; call next on success', () => {
        isAuth(req, res, next)
        expect(next).toBeCalled()
    })

    it('should respond with status code 403 and a json error object on failure', () => {
        req.auth._id = '1ea4922ed1b13982e03c7bd4' //another faux ID
        isAuth(req, res, next)
        expect(res.statusCode).toBe(403)
        expect(res._isEndCalled()).toBeTruthy()
        expect(res._getJSONData()).toStrictEqual({ error: "Access denied." })
    })

})

describe('authController.requireLogin', () => {

    it('should be a function', () => {
        expect(typeof requireLogin).toBe('function')
    })
    //we don't need to unit test the functionality of expressJwt

})

describe('authController.logout', () => {
    
    it('should be a function', () => {
        expect(typeof logout).toBe('function')
    })

    it('should call res.clearCookie and send a success response', async () => {
        res.clearCookie = jest.fn()
        await logout(req, res)
        expect(res.clearCookie).toBeCalled()
        expect(res._getJSONData).toBeTruthy()
    })

})

describe('authController.login', () => {

    beforeEach(() => {
        req.body.email ='zoe@sesamestreet.com'
        req.body.password = 'abcdefg1'
        EcommerceUser._id = id
        EcommerceUser.name = 'Zoe'
        EcommerceUser.email = 'zoe@sesamestreet.com'
        EcommerceUser.role = 0
    })

    it('should be a function', () => {
        expect(typeof login).toBe('function')
    })

    it('should call EcommerceUser.findOne to search the db', async () => {
        await login(req, res)
        expect(EcommerceUser.findOne).toBeCalledWith({ email: req.body.email })
    })

    it('should return status code 404 and json error object if the user is not found', async () => {
        EcommerceUser.findOne.mockReturnValue(undefined)
        await login(req, res)
        expect(res.statusCode).toBe(404)
        expect(res._isEndCalled()).toBeTruthy()
        expect(res._getJSONData()).toStrictEqual({ error: 'Email does not exist.' })
    })

    it('should return a status code of 401 and a json error object if the email and password do not match', async () => {
        EcommerceUser.findOne.mockReturnValue(EcommerceUser)
        EcommerceUser.authenticate = jest.fn()
        await login(req, res)
        expect(EcommerceUser.authenticate).toBeCalledWith(req.body.password)
        expect(res.statusCode).toBe(401)
        expect(res._isEndCalled()).toBeTruthy()
        expect(res._getJSONData()).toStrictEqual({ error: 'Email and password do not match.' })
    })

    it('should generate a signed token', async () => {
        EcommerceUser.findOne.mockReturnValue(EcommerceUser)
        EcommerceUser.authenticate.mockReturnValue(true)
        await login(req, res)
        expect(jwt.sign).toBeCalledWith({ _id: id }, '12345')
    })

    it('should return a status code of 200 and a json object with the user in it on success', async () => {
        EcommerceUser.findOne.mockReturnValue(EcommerceUser)
        EcommerceUser.authenticate.mockReturnValue(true)
        jwt.sign.mockReturnValue(token)
        await login(req, res)
        expect(res.statusCode).toBe(200)
        expect(res._isEndCalled()).toBeTruthy()
        expect(res._getJSONData()).toStrictEqual({ token, 
            user: { 
                _id: id, 
                email: 'zoe@sesamestreet.com', 
                name: 'model', 
                role: 0 
            } 
        })
    })

    it('should return a status code of 400 and a json object with the error on failure', async () => {
        let errorMessage = { error: '' }
        let rejectedPromise = Promise.reject(errorMessage)
        EcommerceUser.findOne.mockReturnValue(rejectedPromise)
        await login(req, res)
        expect(res.statusCode).toBe(400)
        expect(res._isEndCalled()).toBeTruthy()
        expect(res._getJSONData()).toStrictEqual(errorMessage)
    })

})

describe('authController.register', () => {

    it('should be a function', () => {
        expect(typeof register).toBe('function')
    })

    it('should call EcommerceUser', async () => {
        await register(req, res)
        expect(EcommerceUser).toBeCalled()
    })

    it('should return a status code of 201 and a json of the user on success', async () => {
        EcommerceUser.mockImplementation(() => {
            return {
              newUser,
              save: () => {
                return {
                    email: 'zoe@sesamestreet.com',
                    hashedPassword: undefined,
                    name: 'Zoe',
                    password: 'abcdefg1',
                    password2: 'abcdefg1',
                    salt: undefined,
                    _id: id,
                    role: 0
                }
              }
            }
        })
        await register(req, res)
        expect(res.statusCode).toBe(201)
        expect(res._isEndCalled()).toBeTruthy()
        expect(res._getJSONData()).toStrictEqual({user: newUser})
    })
    
    it('should return a status code of 400 and a json of the error on failure', async () => {
        const errorMessage = { error: '' }
        const rejectedPromise = Promise.reject(errorMessage)
        EcommerceUser.mockImplementation(() => {
            return {
              newUser,
              save: () => {
                return rejectedPromise
              }
            }
        })
        await register(req, res)
        expect(res.statusCode).toBe(400)
        expect(res._isEndCalled()).toBeTruthy()
        expect(res._getJSONData()).toStrictEqual(errorMessage)
    }) 

})
