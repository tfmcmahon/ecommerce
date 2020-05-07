const testApp = require('../testApp')
const supertest = require('supertest')
const request = supertest(testApp)

const category = require('../mockData/newCategoryProduct.json')
const product = require('../mockData/newProduct.json')
const order = require('../mockData/updateOrder.json')
let productId, orderId

// db setup
const { setupDB } = require('../testSetup')
setupDB('ecommOrderTesting', true)

describe('Order end points', () => {

  beforeEach(async (done) => {
    const res = await request.post('/api/login')
      .send({
        email: 'count@sesamestreet.com',
        password: 'abcdefg1',
      })
    token = res.body.token
    adminId = res.body.user._id

    //create a category
    const res1 = await request.post(`/api/category/create/${adminId}`)
      .send(category)
      .set({ 
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      })
    product.category = res1.body.data._id

    //create a product
    const res2 = await request.post(`/api/product/create/${adminId}`)
      .set({ 
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      })
      .field('name', product.name)
      .field('description', product.description)
      .field('price', product.price)
      .field('category', product.category)
      .field('quantity', product.quantity)
      productId = res2.body.data._id
      res2.body.data.count = 1
      order.products = [res2.body.data]

    done()
  })

  //test create order route =
  //addOrderToUserHistory (user contrtoller middleware)
  //updateQuantityAndSold (product controller middleware)
  //createOrder (order controller method)
  it('should create an order', async () => {
    const res = await request.post(`/api/order/create/${adminId}`)
      .send({ order })
      .set({ 
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      })
    expect(res.statusCode).toBe(201)
    expect(res.body.status).toBeTruthy()
    orderId = res.body._id
  })

  it('should reject malformed products in the updateQuantityAndSold middleware', async () => {
    order.products[0].count = undefined
    const res = await request.post(`/api/order/create/${adminId}`)
      .send({ order })
      .set({ 
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      })
    expect(res.statusCode).toBe(400)
  })

  it('should list all orders for the corresponding user', async () => {
    //make an order for this test
    await request.post(`/api/order/create/${adminId}`)
      .send({ order })
      .set({ 
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      })

    const res = await request.get(`/api/orders/list/${adminId}`)
      .set({ 
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      })
    expect(res.statusCode).toBe(200)
    expect(res.body[0].status).toBeTruthy()
  })

  it('should get a list of all of a user`s orders` statuses', async () => {
    //make an order for this test
    await request.post(`/api/order/create/${adminId}`)
      .send({ order })
      .set({ 
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      })

    const res = await request.get(`/api/orders/status/${adminId}`)
      .set({ 
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      })
    expect(res.body[0]).toStrictEqual('Not processed')
  })

  describe('PUT /api/orders/:orderId/status/:userId', () => {

    beforeEach(async (done) => {
      //create new orders for the following tests
      const res = await request.post(`/api/order/create/${adminId}`)
      .send({ order })
      .set({ 
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      })
      orderId = res.body._id
      done()
    })

    //orderById
    //updateOrderStatus
    it('should update an order by id', async () => {
      const res = await request.put(`/api/orders/${orderId}/status/${adminId}`)
        .set({ 
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        })
        .send({status: 'Shipped'})
      expect(res.statusCode).toBe(200)
      expect(res.body.nModified).toBe(1)
    })

    it('should not update any products with incorrect order id', async () => {
      const res = await request.put(`/api/orders/${adminId}/status/${adminId}`)
        .set({ 
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        })
        .send({status: 'Shipped'})
      expect(res.statusCode).toBe(404)
    })

  })

})