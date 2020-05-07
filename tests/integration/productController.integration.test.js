const testApp = require('../testApp')
const supertest = require('supertest')
const request = supertest(testApp)

const product = require('../mockData/newProduct.json')
const updateProduct = require('../mockData/updateProduct.json')
const category = require('../mockData/newCategoryProduct.json')
const updateCategory = require('../mockData/newCategory.json')

let productId, categoryId

// db setup
const { setupDB } = require('../testSetup')
setupDB('ecommProductTesting', true)

describe('Product end points', () => {

  //get admin credentials
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

    done()
  })

  describe('GET /api/product/:productId', () => {
    
    //readProduct
    //productById
     it('should read a product by id', async () => {
      const res = await request.get(`/api/product/${productId}`)
      expect(res.statusCode).toBe(200)
      expect(res.body.name).toBe(product.name)
      expect(res.body.description).toBe(product.description)
      expect(res.body.price).toBe(product.price)
      expect(res.body.category._id).toBe(product.category)
      expect(res.body.quantity).toBe(product.quantity)
    })

    it('should respond with status 404 if the product does not exist', async () => {
      const res = await request.get(`/api/product/${adminId}`)
        expect(res.statusCode).toBe(404)
    })

    //updateProduct
    it('should update a product', async () => {
      const res = await request.put(`/api/product/${productId}/${adminId}`)
        .set({ 
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        })
        .field('name', updateProduct.name)
        .field('description', updateProduct.description)
        .field('price', updateProduct.price)
        .field('quantity', updateProduct.quantity)

        expect(res.statusCode).toBe(201)
        expect(res.body.data.name).toBe(updateProduct.name)
        expect(res.body.data.description).toBe(updateProduct.description)
        expect(res.body.data.price).toBe(updateProduct.price)
        expect(res.body.data.category._id).toBe(product.category)
        expect(res.body.data.quantity).toBe(updateProduct.quantity)
    })

    //deleteProduct
    it('should delete the product by id', async () => {
    const res = await request.delete(`/api/product/${productId}/${adminId}`)
      .set({ 
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      })
      expect(res.statusCode).toBe(200)
      expect(res.body.message).toBe('Product deleted successfully.')
    })

  })

  describe('GET specials', () => {

    beforeEach(async () => {
      const res = await request.post('/api/login')
        .send({
          email: 'count@sesamestreet.com',
          password: 'abcdefg1',
        })
      token = res.body.token
        adminId = res.body.user._id

      //create a category
      const res3 = await request.post(`/api/category/create/${adminId}`)
        .send(updateCategory)
        .set({ 
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        })
      product.category = res3.body.data._id

      //create a product
      const res1 = await request.post(`/api/product/create/${adminId}`)
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

      //create a second product
      const res2 = await request.post(`/api/product/create/${adminId}`)
        .set({ 
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        })
        .field('name', updateProduct.name)
        .field('description', updateProduct.description)
        .field('price', updateProduct.price)
        .field('category', product.category)
        .field('quantity', updateProduct.quantity)

      productId = res2.body.data._id
      productId2 = res1.body.data._id
    })

    //listProducts
    it('should return a list of products that match a request query', async () => {
      const res = await request.get('/api/products?sortBy=createdAt&order=desc&limit=4')
      expect(res.statusCode).toBe(200)
      expect(typeof res.body).toBe('object')
      expect(res.body[0].name).toBeDefined()
    })

    //listRelatedProducts
    it('should return a list of related products', async () => {
      const res = await request.get(`/api/products/related/${productId}`)
      expect(res.statusCode).toBe(200)
      expect(typeof res.body).toBe('object')
      expect(res.body[0].name).toBeDefined()
    })

    //listProductsByUserSearch
    it('should return a list of products based on a user search', async () => {
      const res = await request.get(`/api/products/user/search?search=Test%20Poster&category=${product.category}`)
      expect(res.statusCode).toBe(200)
      expect(typeof res.body).toBe('object')
      expect(res.body[0].name).toBeDefined()
    })

    it('should return an error if no query is included', async () => {
      const res = await request.get(`/api/products/user/search?`)
      expect(res.statusCode).toBe(400)
      expect(typeof res.body).toBe('object')
    })

    //listProductCategories
    it('should list categories that have products in them', async () => {
      const res = await request.get('/api/products/categories')
      expect(res.statusCode).toBe(200)
      expect(typeof res.body).toBe('object')
    })

    //listProductsBySearch
    it('should list products by search filters', async () => {
      let data = {
        limit: 6,
        skip: 0,
        filters: {
          price: [0, 4.99]
        }
      }
      const res = await request.post('/api/products/search')
        .send(data)
        .set({
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        })
      expect(res.statusCode).toBe(200)
      expect(typeof res.body).toBe('object')
      expect(res.body.products[0].name).toBeDefined()
    })

    //productPhoto
    it('should return a photo to a corresponding product, if it exists', async () => {
      const res = await request.get(`/product/photo/${productId2}`)
      expect(res.body).toBeDefined()
    })

    //updateQuantityAndSold -- middleware for orders route

  })

  describe('POST /api/product/create/:userId', () => {

    //createProduct
    it('should create a product', async () => {
      const res = await request.post(`/api/product/create/${adminId}`)
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

      expect(res.statusCode).toBe(201)
      expect(res.body.data.name).toBe(product.name)
      expect(res.body.data.description).toBe(product.description)
      expect(res.body.data.price).toBe(product.price)
      expect(res.body.data.category).toBe(product.category)
      expect(res.body.data.quantity).toBe(product.quantity)
    })

    it('should return a 500 response code on malformed data with', async () => {
      const res = await request.post(`/api/product/create/${adminId}`)
        .set({ 
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        })
        .field('name', product.name)

      expect(res.statusCode).toBe(400)
    })

  })

})