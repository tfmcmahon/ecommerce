const { generateToken, processPayment } = require('../../controllers/braintreeController')
const httpMocks = require('node-mocks-http')

jest.mock('../../braintreeLib/gateway')

let req, res, id
beforeEach(() => {
    req = httpMocks.createRequest()
    res = httpMocks.createResponse()
    id = '5ea4925ed1b1d982e03c7bd4' //faux ID
})

describe('braintreeController.processPayment', () => {

  it('should be a function', () => {
    expect(typeof processPayment).toBe('function')
  })

  it('should respond with a status code of 200 and appropriate transaction data on success', async () => {
    req.body = {}
    req.body.paymentMethodNonce = 'tokencc_bf_6dsg8q_jpw7gn_yyff35_vvvt48_x5z'
    req.body.amount = '2000'
    await processPayment(req, res)
    expect(res.statusCode).toBe(200)
    expect(res._isEndCalled()).toBeTruthy()
    expect(res._getJSONData()).toBeTruthy()
  })

  it('should respond with a status code of 500 and error json on failture', async () => {
    req.body = {}
    req.body.paymentMethodNonce = 'tokencc_bf_6dsg8q_jpw7gn_yyff35_vvvt48_x5z'
    req.body.amount = '12'
    await processPayment(req, res)
    expect(res.statusCode).toBe(500)
    expect(res._isEndCalled()).toBeTruthy()
    expect(res._getJSONData()).toBeTruthy()
  })

})

describe('braintreeController.generateToken', () => {

  it('should be a function', () => {
    expect(typeof generateToken).toBe('function')
  })

  it('should respond with a status code of 200 and a token on success', async () => {
    await generateToken(req, res)
    expect(res.statusCode).toBe(200)
    expect(res._isEndCalled()).toBeTruthy()
    expect(res._getData()).toStrictEqual({ clientToken: 'bgclfngciljbnvgfujktjuhdb' })
  })

})