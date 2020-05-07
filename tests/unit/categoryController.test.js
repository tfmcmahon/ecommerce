const { 
  createCategory, 
  listAllCategories, 
  categoryById, 
  readCategory, 
  updateCategory,
  deleteCategory 
} = require('../../controllers/categoryController')
const EcommerceCategory = require('../../models/categoryModel')
const httpMocks = require('node-mocks-http')
const category = require('../mockData/newCategory.json')
const data = require('../mockData/allCategories.json')

//spy to check if the model is being called
//mock all model functions with jest.mock
jest.mock('../../models/categoryModel') 

let req, res, next, id
beforeEach(() => {
  req = httpMocks.createRequest()
  res = httpMocks.createResponse()
  next = jest.fn()
  id = '5ea4925ed1b1d982e03c7bd4' //faux ID
})

describe('categoryController.deleteCategory', () => {

  beforeEach(() => {
    req.body = category
    req.category = category
    req.category._id = id
  })

  it('should be a function', () => {
    expect(typeof deleteCategory).toBe('function')
  })

  it('should delete a category with EcommerceCategory.remove', async () => {
    await deleteCategory(req, res)
    expect(EcommerceCategory.deleteOne).toBeCalledWith({ name: category.name })
  })

  it('should return a status of 200 and a success json object', async () => {
    await deleteCategory(req, res)
    expect(res.statusCode).toBe(200)
    expect(res._isEndCalled()).toBeTruthy()
    expect(res._getJSONData()).toStrictEqual({ message: 'Category deleted successfully.' })
  })

  it('should handle errors with a reponse status of 400 and a json error', async () => {
    const errorMessage = { error: '' }
    const rejectedPromise = Promise.reject(errorMessage)
    EcommerceCategory.deleteOne.mockResolvedValue(rejectedPromise)
    await deleteCategory(req, res)
    expect(res.statusCode).toBe(400)
    expect(res._isEndCalled()).toBeTruthy()
    expect(res._getJSONData()).toStrictEqual(errorMessage)
  })

})

describe('categoryController.updateCategory', () => {

  beforeEach(() => {
    req.body = category
    req.category = category
    req.category._id = id
  })

  it('should be a function', () => {
    expect(typeof updateCategory).toBe('function')
  })

  it('should update with EcommerceCategory.findByIdAndUpdate', async () => {
    await updateCategory(req, res)
    expect(EcommerceCategory.findByIdAndUpdate).toBeCalledWith(id, category, {
      new: true,
      useFindAndModify: false
    })
  })

  it('should return a reponse status of 200 and the updated category in json format', async () => {
    let data = category
    EcommerceCategory.findByIdAndUpdate.mockReturnValue(category)
    await updateCategory(req, res)
    expect(res.statusCode).toBe(200)
    expect(res._isEndCalled()).toBeTruthy()
    expect(res._getJSONData()).toStrictEqual({ data })
  })

  it('should return a status of 400 and an error json if the update fails', async () => {
    const errorMessage = { error: '' }
    const rejectedPromise = Promise.reject(errorMessage)
    EcommerceCategory.findByIdAndUpdate.mockResolvedValue(rejectedPromise)
    await updateCategory(req, res)
    expect(res.statusCode).toBe(400)
    expect(res._isEndCalled()).toBeTruthy()
    expect(res._getJSONData()).toStrictEqual(errorMessage)
  })

})

describe('categoryController.categoryById', () => {

  it('should be a function', () => {
    expect(typeof categoryById).toBe('function')
  })

  it('should call EcommerceCategory.findById with route params', async () => {
    await categoryById(req, res, next, id)
    expect(EcommerceCategory.findById).toBeCalledWith('5ea4925ed1b1d982e03c7bd4')
  })

  it('should attach the category to the request', async () => {
    EcommerceCategory.findById.mockReturnValue(category)
    await categoryById(req, res, next, id)
    expect(req.category).toStrictEqual(category)
  })

  it('should call next', async () => {
    await categoryById(req, res, next, id)
    expect(next).toBeCalled()
  })
  
  it('should return a reponse status of 404 and a json error if the category does not exist', async () => {
    const errorMessage = { error: 'Category does not exist.' }
    EcommerceCategory.findById.mockReturnValue(null)
    await categoryById(req, res, next, id)
    expect(next).not.toBeCalled()
    expect(res.statusCode).toBe(404)
    expect(res._isEndCalled()).toBeTruthy()
    expect(res._getJSONData()).toStrictEqual(errorMessage)
  })

  it('should handle errors with a reponse status of 400 and a json error', async () => {
    const errorMessage = { error: '' }
    const rejectedPromise = Promise.reject(errorMessage)
    EcommerceCategory.findById.mockResolvedValue(rejectedPromise)
    await categoryById(req, res, next, id)
    expect(res.statusCode).toBe(400)
    expect(res._isEndCalled()).toBeTruthy()
    expect(res._getJSONData()).toStrictEqual(errorMessage)
  })

})

describe('categoryController.readCategory', () => {

  it('should be a function', () => {
    expect(typeof readCategory).toBe('function')
  })

  it('should return a reponse status of 200 and the category in json format', async () => {
    req.category = category
    await readCategory(req, res)
    expect(res.statusCode).toBe(200)
    expect(res._isEndCalled()).toBeTruthy()
    expect(res._getJSONData()).toStrictEqual(category)
  })

})

describe('categoryController.listAllCategories', () => {

  it('should be a function', () => {
    expect(typeof listAllCategories).toBe('function')
  })

  it('should call EcommerceCategory.find', async () => {
    await listAllCategories(req, res)
    expect(EcommerceCategory.find).toBeCalled()
  })

  it('should return response with status 200 and all categories', async () => {
    EcommerceCategory.find = jest.fn()
      .mockImplementationOnce(() => ({
        sort: jest.fn().mockResolvedValueOnce(data)
      })
    )
    await listAllCategories(req, res)
    expect(res.statusCode).toBe(200)
    expect(res._isEndCalled()).toBeTruthy()
    expect(res._getJSONData()).toStrictEqual({data})
  })

  it('should handle errors with a reponse status of 400 and a json error', async () => {
    const errorMessage = { error: '' }
    const rejectedPromise = Promise.reject(errorMessage)
    EcommerceCategory.find = jest.fn()
      .mockImplementationOnce(() => ({
        sort: jest.fn().mockResolvedValueOnce(rejectedPromise)
      })
    )
    await listAllCategories(req, res)
    expect(res.statusCode).toBe(400)
    expect(res._isEndCalled()).toBeTruthy()
    expect(res._getJSONData()).toStrictEqual(errorMessage)
  })

})

describe('categoryController.createCategory', () => {

  beforeEach(() => {
    req.body = category
  })

  it('should be a function', () => {
    expect(typeof createCategory).toBe('function')
  })

  it('should call EcommerceCategory.create', () => {
    createCategory(req, res)
    expect(EcommerceCategory.create).toBeCalledWith(category)
  })

  it('should return a 201 response code', async () => {
    await createCategory(req, res)
    expect(res.statusCode).toBe(201)
    expect(res._isEndCalled()).toBeTruthy()
  })

  it('should return json body in response', async () => {
    let data = category
    EcommerceCategory.create.mockReturnValue(category)
    await createCategory(req, res)
    expect(res._getJSONData()).toStrictEqual({data})
  })
    
  it('should handle errors with a reponse status of 500 and a json error when sent malformed data', async () => {
    const errorMessage = { error: 'Name field is required.' }
    const rejectedPromise = Promise.reject(errorMessage)
    EcommerceCategory.create.mockResolvedValue(rejectedPromise)
    await createCategory(req, res)
    expect(res.statusCode).toBe(500)
    expect(res._isEndCalled()).toBeTruthy()
  })
})
