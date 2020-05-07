const testApp = require('../testApp')
const supertest = require('supertest')
const request = supertest(testApp)

const category = require('../mockData/newCategoryProduct.json')
const order = require('../mockData/updateOrder.json')
const product = require('../mockData/newProduct.json')
let userId, productId, token, adminToken

// db setup
const { setupDB } = require('../testSetup')
setupDB('ecommUserTesting', true)

describe('User end points', () => { 

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
  
  //readUser
  it('should get a user profile by id', async () => {
    const res = await request.get(`/api/user/${userId}`)
      .set({ 
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      })
    expect(res.status).toBe(200)
    expect(res.body.name).toBe('Grover')
    expect(res.body.hashedPassword).toBe(undefined)
    expect(res.body.salt).toBe(undefined)
  })

  //updateUser
  it('should update the user', async () => {
    const res = await request.put(`/api/user/${userId}`)
      .set({ 
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      })
      .send({name: 'Elmo'})
    expect(res.status).toBe(200)
    expect(res.body.name).toBe('Elmo')
    expect(res.body.hashedPassword).toBe(undefined)
    expect(res.body.salt).toBe(undefined)
  })

  describe('get user order history', () => {

    beforeEach(async done => {
      //get the admin credentials ...
      const res = await request.post('/api/login')
        .send({
          email: 'count@sesamestreet.com',
          password: 'abcdefg1',
        })
      adminToken = res.body.token
      adminId = res.body.user._id

      //create a category ...
      const res1 = await request.post(`/api/category/create/${adminId}`)
        .send(category)
        .set({ 
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}` 
        })
      product.category = res1.body.data._id

      //create a product ...
      const res2 = await request.post(`/api/product/create/${adminId}`)
        .set({ 
          'Accept': 'application/json',
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'multipart/form-data'
        })
        .field('name', product.name)
        .field('description', product.description)
        .field('price', product.price)
        .field('category', product.category)
        .field('quantity', product.quantity)
      res2.body.data.count = 1
      order.products = [res2.body.data]
      productId = res2.body.data._id

      //create an order
      await request.post(`/api/order/create/${userId}`)
        .send({ order })
        .set({ 
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        })

      done()
    })

    //getOrderHistory
    it('should get a user`s order history', async () => {
      const res = await request.get(`/api/user/${userId}`)
        .set({ 
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        })
      expect(res.status).toBe(200)
      expect(res.body.history).toBeTruthy()
      expect(res.body.history[0]._id).toStrictEqual(productId)
    })

  })

})