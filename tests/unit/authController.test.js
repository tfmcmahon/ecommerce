const { register, login, logout } = require('../../controllers/authController')
const EcommerceUser = require('../../models/userModel')
const httpMocks = require('node-mocks-http')
const newUser = require('../mockData/newUser.json')

EcommerceUser.create = jest.fn() //spy to check if the model is being called

let req, res, next
beforeEach(() => {
    req = httpMocks.createRequest()
    res = httpMocks.createResponse()
    next = null
})

describe('authController.register', () => {

    beforeEach(() => {
        req.body = newUser
    })

    it('should be a function', () => {
        expect(typeof register).toBe('function')
    })

    it('should call user.create', () => {
        register(req, res)
        expect(EcommerceUser.create).toBeCalledWith(newUser)
    }) 

    it('should return 201 response code', async () => {
        await register(req, res)
        expect(res.statusCode).toBe(201)
        expect(res._isEndCalled()).toBeTruthy()
    })

    it('should return json body in response', async () => {
        EcommerceUser.create.mockReturnValue(newUser)
        await register(req, res)
        expect(res._getJSONData()).toStrictEqual(newUser)
    })
})
