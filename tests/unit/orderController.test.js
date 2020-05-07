const { 
  createOrder, 
  listOrders, 
  getOrderStatus, 
  updateOrderStatus,
  orderById
} = require('../../controllers/orderController')
const { EcommerceOrder } = require('../../models/orderModel')
const httpMocks = require('node-mocks-http')
const order = require('../mockData/newOrder.json')

//spy to check if the model is being called
//mock all model functions with jest.mock
jest.mock('../../models/orderModel') 

let req, res, next, id
beforeEach(() => {
  req = httpMocks.createRequest()
  res = httpMocks.createResponse()
  next = jest.fn()
  id = '5ea4925ed1b1d982e03c7bd4' //faux ID
})

describe('orderController.updateOrderStatus', () => {

  beforeEach(() => {
    req.order = {}
    req.order._id = id
    req.body.status = 'Shipped'
  })

  it('should be a function', () => {
    expect(typeof updateOrderStatus).toBe('function')
  })

  it('should call EcommerceOrder.updateOne to update an order', async () => {
    EcommerceOrder.updateOne.mockReturnValue({ nModified: 1 })
    await updateOrderStatus(req, res)
    expect(EcommerceOrder.updateOne).toBeCalled()
  })

  it('should return a status code of 200 and a json with the updated order on success', async () => {
    EcommerceOrder.updateOne.mockReturnValue({ nModified: 1 })
    await updateOrderStatus(req, res)
    expect(res.statusCode).toBe(200)
    expect(res._isEndCalled()).toBeTruthy()
    expect(res._getJSONData()).toStrictEqual({ nModified: 1 })
  })

  it('should return a status code of 400 and a json with an error message on failure', async () => {
    EcommerceOrder.updateOne.mockReturnValue({ nModified: 0 })
    await updateOrderStatus(req, res)
    expect(res.statusCode).toBe(400)
    expect(res._isEndCalled()).toBeTruthy()
    expect(res._getJSONData()).toStrictEqual({ error: 'Could not update order' })
  })

})

describe('orderController.getOrderStatus', () => {

  it('should be a function', () => {
    expect(typeof getOrderStatus).toBe('function')
  })

  it('should return the enum values of the order schema', async () => {
    let enumVals = ['Not processed', 'Processing', 'Shipped', 'Delivered', 'Cancelled']
    EcommerceOrder.schema.path = jest.fn().mockImplementation(() => ({
      enumValues: jest.fn().mockReturnValue(enumVals)
    }))
    await getOrderStatus(req, res)
    expect(res._isEndCalled()).toBeTruthy()
  })

})

describe('orderController.listOrders', () => {
  
  it('should be a function', () => {
    expect(typeof listOrders).toBe('function')
  })

  it('should call EcommerceOrder.find', async () => {
    await listOrders(req, res)
    expect(EcommerceOrder.find).toBeCalled()
  })

  it('should return status code 200 and json with the order results', async () => {
    EcommerceOrder.find.mockImplementation(() => ({
      populate: jest.fn().mockImplementation(() => ({
        sort: jest.fn().mockReturnValue(order)
      }))
    }))
    await listOrders(req, res)
    expect(res.statusCode).toBe(200)
    expect(res._isEndCalled()).toBeTruthy()
    expect(res._getJSONData()).toStrictEqual(order)
  })

  it('should return status code 400 and json error for malformed request', async () => {
    let errorMessage = ({ error: '' })
    let rejectedPromise = Promise.reject(errorMessage)
    EcommerceOrder.find.mockImplementation(() => ({
      populate: jest.fn().mockImplementation(() => ({
        sort: jest.fn().mockResolvedValueOnce(rejectedPromise)
      }))
    }))
    await listOrders(req, res)
    expect(res.statusCode).toBe(400)
    expect(res._isEndCalled()).toBeTruthy()
    expect(res._getJSONData()).toStrictEqual(errorMessage)
  })

})

describe('orderController.orderById', () => {

  it('should be a function', () => {
    expect(typeof orderById).toBe('function')
  })

  it('should call EcommerceOrder.findById with route params', async () => {
    await orderById(req, res, next, id)
    expect(EcommerceOrder.findById).toHaveBeenCalledWith(id)
  })

  it('should attach the order to the request and call next', async () => {
    EcommerceOrder.findById.mockImplementationOnce(() => ({
      populate: jest.fn().mockResolvedValueOnce(order)
    }))
    await orderById(req, res, next, id)
    expect(req.order).toStrictEqual(order)
    expect(next).toBeCalled()
  })

  it('should respond with a status code of 404 and an error json if the order does not exist', async () => {
    EcommerceOrder.findById.mockImplementationOnce(() => ({
      populate: jest.fn().mockResolvedValueOnce(null)
    }))
    await orderById(req, res, next, id)
    expect(res.statusCode).toBe(404)
    expect(res._isEndCalled()).toBeTruthy()
    expect(res._getJSONData()).toStrictEqual({ error: 'Order not found.' })
  })

  it('should handle errors with a reponse status of 400 and a json error', async () => {
    let errorMessage = { error: '' }
    let rejectedPromise = Promise.reject(errorMessage)
    EcommerceOrder.findById.mockImplementationOnce(() => ({
      populate: jest.fn().mockResolvedValueOnce(rejectedPromise)
    }))
    await orderById(req, res, next, id)
    expect(res.statusCode).toBe(400)
    expect(res._isEndCalled()).toBeTruthy()
    expect(res._getJSONData()).toStrictEqual(errorMessage)
  })

})

describe('orderController.createOrder', () => {

  beforeEach(() => {
    req.body.order = order
    req.profile = id
  })

  it('should be a function', () => {
    expect(typeof createOrder).toBe('function')
  })

  it('should create a new order with EcommerceOrder.create', async () => {
    await createOrder(req, res)
    expect(EcommerceOrder.create).toBeCalledWith(order)
  })

  it('should return a 201 response code and a json order in response', async () => {
    let data = order
    EcommerceOrder.create.mockReturnValue(data)
    await createOrder(req, res)
    expect(res.statusCode).toBe(201)
    expect(res._isEndCalled()).toBeTruthy()
    expect(res._getJSONData()).toStrictEqual(data)
  })

  it('should handle errors with a reponse status of 500 and a json error when sent malformed data', async () => {
    const errorMessage = { error: '' }
    const rejectedPromise = Promise.reject(errorMessage)
    EcommerceOrder.create.mockReturnValue(rejectedPromise)
    await createOrder(req, res)
    expect(res.statusCode).toBe(500)
    expect(res._isEndCalled()).toBeTruthy()
    expect(res._getJSONData()).toStrictEqual(errorMessage)
  })

})