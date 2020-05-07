const testApp = require('../testApp')
const supertest = require('supertest')
const request = supertest(testApp)
//const gateway = require('../../braintreeLib/gateway')

let userId, token

// db setup
const { setupDB } = require('../testSetup')
setupDB('ecommBraintreeTesting', true)

describe('Braintree end points', () => { 

  //get login token from a seeded user
  beforeEach(async done => {
    const res = await request.post('/api/login')
      .send({
        email: 'grover@sesamestreet.com',
        password: 'abcdefg1',
      })
    token = res.body.token
    userId = res.body.user._id
    done()
  })

  //generateToken
  it('should genereate a braintree token', async () => {
    const res = await request.get(`/api/braintree/getToken/${userId}`)
      .set({ 
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      })
    expect(res.status).toBe(200)
    expect(res.body.clientToken).toBeTruthy()
  })

  it('should respond with a status of 200 after a successful payment', async () => {

    const res = await request.post(`/api/braintree/payment/${userId}`)
      .set({ 
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      })
      .send({  
        amount: '11.00',
        paymentMethodNonce: 'fake-valid-nonce'
      })
    expect(res.status).toBe(200)
    expect(res.body.transaction).toBeTruthy()
  })

})