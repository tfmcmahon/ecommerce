const { 
  userById,
  readUser,
  updateUser,
  getOrderHistory,
  addOrderToUserHistory
} = require('../../controllers/userController')
const EcommerceUser = require('../../models/userModel')
const { EcommerceOrder } = require('../../models/orderModel')

const httpMocks = require('node-mocks-http')
const user = require('../mockData/newUser.json')
const newUser = require('../mockData/updateUser.json')
const product = require('../mockData/newProduct.json')
const newProduct = require('../mockData/updateProduct.json')
const orders = require('../mockData/newOrder.json') 


jest.mock('../../models/userModel') 
jest.mock('../../models/orderModel')

let req, res, next, id, errorMessage, rejectedPromise, newUserInstance, productInstance, newProductInstance
beforeEach(() => {
  req = httpMocks.createRequest()
  res = httpMocks.createResponse()
  next = jest.fn()
  id = '5ea4925ed1b1d982e03c7bd4' //faux ID
})

describe('userController.getOrderHistory', () => {

  beforeEach(() => {
    user.id = id
    req.profile = user
  })

  it('should be a function', () => {
    expect(typeof getOrderHistory).toBe('function')
  })

  it('should call EcommerceOrder.find to search for an order', async () => {
    await getOrderHistory(req, res)
    expect(EcommerceOrder.find).toBeCalledWith({ user: user._id })
  })

  it('should return a status code of 200 and a json object with the orders', async () => {
    EcommerceOrder.find.mockImplementationOnce(() => ({
      populate: jest.fn().mockImplementationOnce(() => ({
        sort: jest.fn().mockReturnValue(orders)
      }))
    }))
    await getOrderHistory(req, res)
    expect(res.statusCode).toBe(200)
    expect(res._isEndCalled()).toBeTruthy()
    expect(res._getJSONData()).toStrictEqual(orders)
  })

  it('should return a status of 401 and an error json if the update fails', async () => {
    const errorMessage = { error: '' }
    const rejectedPromise = Promise.reject(errorMessage)
    EcommerceOrder.find.mockImplementationOnce(() => ({
      populate: jest.fn().mockImplementationOnce(() => ({
        sort: jest.fn().mockReturnValue(rejectedPromise)
      }))
    }))
    await getOrderHistory(req, res)
    expect(res.statusCode).toBe(400)
    expect(res._isEndCalled()).toBeTruthy()
    expect(res._getJSONData()).toStrictEqual(errorMessage)
  })

})

describe('userController.addOrderToUserHistory', () => {

  beforeEach(() => {
    req.profile = user
    productInstance = product
    productInstance._id = id
    productInstance.count = 3
    newProductInstance = newProduct
    newProductInstance._id = id
    newProductInstance.count = 2
    req.body.order = {}
    req.body.order.products = [productInstance, newProductInstance]
    req.body.order.amount = 20
    req.body.order.transactionId = id
  })

  it('should be a function', () => {
    expect(typeof addOrderToUserHistory).toBe('function')
  })

  it('should populate the history array with products', async () => {
    await addOrderToUserHistory(req, res, next)
    expect(EcommerceUser.findOneAndUpdate).toBeCalled()
  })

  it('should call next on success', async () => {
    let resolvedPromise = Promise.resolve(true)
    EcommerceUser.findOneAndUpdate.mockResolvedValueOnce(resolvedPromise)
    await addOrderToUserHistory(req, res, next)
    expect(next).toBeCalled()
  })

  it('should return a status code of 400 and a json object with the error on failure', async () => {
    let errorMessage = { error: '' }
    let rejectedPromise = Promise.reject(errorMessage)
    EcommerceUser.findOneAndUpdate.mockResolvedValue(rejectedPromise)
    await addOrderToUserHistory(req, res, next)
    expect(res.statusCode).toBe(400)
    expect(res._isEndCalled()).toBeTruthy()
    expect(res._getJSONData()).toStrictEqual(errorMessage)
  })

})

describe('userController.updateUser', () => {

  beforeEach(() => {
    req.profile = user
    req.body = newUser
    req.profile._id = id
    newUserInstance = newUser
    newUserInstance.salt = undefined
    newUserInstance.hashedPassword = undefined
  })

  it('should be a function', () => {
    expect(typeof updateUser).toBe('function')
  })

  it('should update with EcommerceUser.findOneAndUpdate', async () => {
    await updateUser(req, res)
    expect(EcommerceUser.findOneAndUpdate).toBeCalledWith(
      { _id: req.profile._id}, 
      { $set: newUser }, 
      { new: true, useFindAndModify: false }
    )
  })

  it('should return a status code of 200 and a json object with the updated user', async () => {
    EcommerceUser.findOneAndUpdate.mockReturnValue(newUserInstance)
    await updateUser(req, res)
    expect(res.statusCode).toBe(200)
    expect(res._isEndCalled()).toBeTruthy()
    expect(res._getJSONData()).toBeTruthy()
  })

  it('should return a status of 401 and an error json if the update fails', async () => {
    const errorMessage = { error: 'You are not authorized to perform this action.' }
    const rejectedPromise = Promise.reject(errorMessage)
    EcommerceUser.findOneAndUpdate.mockReturnValue(rejectedPromise)
    await updateUser(req, res)
    expect(res.statusCode).toBe(401)
    expect(res._isEndCalled()).toBeTruthy()
    expect(res._getJSONData()).toStrictEqual(errorMessage)
  })

})

describe('userController.readUser', () => {

  it('should be a function', () => {
    expect(typeof readUser).toBe('function')
  })

  it('should return a reponse status of 200 and the user in json format', async () => {
    req.profile = user
    await readUser(req, res)
    expect(res.statusCode).toBe(200)
    expect(res._isEndCalled()).toBeTruthy()
    expect(req.profile.salt).toBe(undefined)
    expect(req.profile.hashedPassword).toBe(undefined)
  })

})

describe('userController.userById', () => {

  it('should be a function', () => {
    expect(typeof userById).toBe('function')
  })

  it('should call EcommerceUser.findById', async () => {
    await userById(req, res, next, id)
    expect(EcommerceUser.findById).toBeCalledWith(id)
  })

  it('should attach the user to the request and call next', async () => {
    EcommerceUser.findById.mockReturnValue(user)
    await userById(req, res, next, id)
    expect(req.profile).toStrictEqual(user)
    expect(next).toBeCalled()
  })

  it('should return status code 404 and an error json if the user cannot be found', async () => {
    EcommerceUser.findById.mockReturnValue(undefined)
    await userById(req, res, next, id)
    expect(res.statusCode).toBe(404)
    expect(res._isEndCalled()).toBeTruthy()
    expect(res._getJSONData()).toStrictEqual({ error: 'User not found.' })
  })

  it('should return status code 400 and an error json if the user cannot be found', async () => {
    errorMessage = { error: '' }
    rejectedPromise = Promise.reject(errorMessage)
    EcommerceUser.findById.mockReturnValue(rejectedPromise)
    await userById(req, res, next, id)
    expect(res.statusCode).toBe(400)
    expect(res._isEndCalled()).toBeTruthy()
    expect(res._getJSONData()).toStrictEqual(errorMessage)
  })

})