const testApp = require('../testApp')
const supertest = require('supertest')
const request = supertest(testApp)
const EcommerceCategory = require('../../models/categoryModel')

const category = require('../mockData/newCategory.json')
let categoryId, adminId, token, expiredId

// db setup
const { setupDB } = require('../testSetup')
setupDB('ecommCategoryTesting', true)

describe('Category end points', () => {

  //get admin credentials
  beforeEach(async (done) => {
    const res = await request.post('/api/login')
    .send({
      email: 'count@sesamestreet.com',
      password: 'abcdefg1',
    })
    token = res.body.token
    adminId = res.body.user._id
    done()
  })

  //createCategory
  it('should create a category', async () => {
    const res = await request.post(`/api/category/create/${adminId}`)
      .send(category)
      .set({ 
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      })
    expect(res.statusCode).toBe(201)
    //check that the category exists in the db
    const newCategory = await EcommerceCategory.findOne({ name: 'test' })
    expect(newCategory.name).toBe('test')
    expect(res.body.data.name).toBe(category.name)
  })

  it('should return a 500 response code on malformed data with', async () => {
    const res = await request.post(`/api/category/create/${adminId}`)
      .send({ title: 'title instead of name' })
      .set({ 
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      })

      expect(res.statusCode).toBe(500)
      expect(res.body).toStrictEqual({ error: "Name field is required." })
  })

  //listAllCategories
  it('should list all categories', async () => {
    const res = await request.get('/api/categories/all')

    expect(res.statusCode).toBe(200)
    //search for all categories
    const categories = await EcommerceCategory.find({})
    expect(categories.length).toBeGreaterThanOrEqual(3)
    expect(typeof res.body.data).toBe('object')
    expect(res.body.data[0].name).toBeDefined()
    expiredId = res.body.data[0]._id
  })

  //categoryById
  //readCategory
  it('should get a category by ID', async () => {
    //get the latest category id
    const categories = await EcommerceCategory.find({})
    categoryId = categories[0]._id
    const res = await request.get(`/api/category/${categoryId}`)
    expect(res.statusCode).toBe(200)
    expect(res.body.name).toBe(categories[0].name)
  })

  it('should should respond with status 404 and json error if the category does not exist', async () => {
    const res = await request.get(`/api/category/${expiredId}`)
      expect(res.statusCode).toBe(404)
      expect(res.body.error).toBe('Category does not exist.')
  })

  //updateCategory
  it('should update a category by ID', async () => {
    //get the latest category id
    const categories = await EcommerceCategory.find({})
    categoryId = categories[0]._id
    const res = await request.put(`/api/category/${categoryId}/${adminId}`)
      .send({ name: 'integration test' })
      .set({ 
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      })
    expect(res.statusCode).toBe(200)
    expect(res.body.data.name).toBe('integration test')
  })
  
  //deleteCategory
  it('should delete a category', async () => {
    const categories = await EcommerceCategory.find({})
    categoryId = categories[0]._id
    const res = await request.delete(`/api/category/${categoryId}/${adminId}`)
      .set({ 
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      })
    expect(res.statusCode).toBe(200)
    expect(res.body.message).toBe('Category deleted successfully.')
  })

})