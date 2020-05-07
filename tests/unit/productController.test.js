const {
  createProduct,
  readProduct,
  updateProduct,
  deleteProduct,
  productById,
  listProducts,
  listRelatedProducts,
  listProductCategories,
  listProductsBySearch,
  listProductsByUserSearch,
  productPhoto,
  updateQuantityAndSold
} = require('../../controllers/productController')
const EcommerceProduct = require('../../models/productModel')   //sold, shipping and photo are not required
const formidable = require('formidable')
const httpMocks = require('node-mocks-http')
const product = require('../mockData/newProduct.json')
const products = require('../mockData/allProducts.json')
const categories = require('../mockData/allCategories.json')
const fs = require('fs')
const lodash = require('lodash')

//spy to check if the model is being called
//mock all model functions with jest.mock
jest.mock('../../models/productModel')
EcommerceProduct.save = jest.fn()

jest.mock('fs', () => ({
  readFileSync: jest.fn()
}))

jest.mock('lodash', () => ({
  extend: jest.fn()
}))

//formidable mock
jest.mock('formidable', () => {
  const form = {
    keepExtensions: true,
    parse: jest.fn(),
  }
  return {
    IncomingForm: jest.fn(() => form),
  }
})

//fs mock
jest.mock('fs')

//set up (req, res) before each test with httpMocks
let req, res, fields, form, files, originalCallback, id, next, productInstance
beforeEach(() => {
  req = httpMocks.createRequest()
  res = httpMocks.createResponse()
  id = '5ea4925ed1b1d982e03c7bd4' //faux ID
  next = jest.fn()
  productInstance = product
  productInstance.remove = jest.fn()
})

describe('productController.updateQuantityAndSold', () => {

  it('should be a function', () => {
    expect(typeof updateQuantityAndSold).toBe('function')
  })

  it('should call EcommerceProduct.bulkWrite with a populated bulk options object from the products in the request', async () => {
    let bulkOptionsInstance =  [{          
      updateOne: {
        filter: { _id: id },       
        update: {                           
          $inc: {                         
            quantity: -product.count,   
            sold: +product.count        
          } 
        }
      }
    }]
    product._id = id
    req.body.order = {
      products: [product]
    }
    await updateQuantityAndSold(req, res, next)
    expect(EcommerceProduct.bulkWrite).toBeCalledWith(bulkOptionsInstance, {})
    expect(next).toBeCalled()
  })

  it('should respond with a status code of 400 and a json error object when it recieves malformed data', async () => {
    product._id = id
    req.body.order = {
      products: [product]
    }
    let errorMessage = ({ error: 'Could not update product.' })
    let rejectedPromise = Promise.reject(errorMessage)
    EcommerceProduct.bulkWrite.mockReturnValue(rejectedPromise)
    await updateQuantityAndSold(req, res, next)
    expect(res.statusCode).toBe(400)
    expect(res._isEndCalled()).toBeTruthy()
    expect(res._getJSONData()).toStrictEqual(errorMessage)
  })

})

describe('productController.productPhoto', () => {

  it('should be a function', () => {
    expect(typeof productPhoto).toBe('function')
  })

  it('should set the content type and send the photo data', async () => {
    req.product = product
    await productPhoto(req, res, next)
    expect(res._isEndCalled()).toBeTruthy()
  })

  it('should call next if there is no photo', async () => {
    product.photo.data = null
    req.product = product
    await productPhoto(req, res, next)
    expect(next).toBeCalled()
  })

})

describe('productController.listProductsBySearch', () => {

  it('should be a function', () => {
    expect(typeof listProductsBySearch).toBe('function')
  })

  it('should call EcommerceProduct.find with a search object built from the request filters', async () => {
    req.body.filters = {
      price: [0, 4.99]
    }
    let findArgsInstance = {
      price: {
        "$gte": 0,
        "$lte": 4.99,
      }
    }
    await listProductsBySearch(req, res)
    expect(EcommerceProduct.find).toHaveBeenCalledWith(findArgsInstance)
  })

  it('should return a response code of 200 and a json object with the size and products', async () => {
    req.body.filters = {
      price: [0, 4.99]
    }
    EcommerceProduct.find.mockImplementation(() => ({
      select: jest.fn().mockImplementation(() => ({
        populate: jest.fn().mockImplementation(() => ({
          sort: jest.fn().mockImplementation(() => ({
            skip: jest.fn().mockImplementation(() => ({
              limit: jest.fn().mockResolvedValueOnce({ size: 2, products })
            }))
          }))
        }))
      }))
    }))
    await listProductsBySearch(req, res)
    expect(res.statusCode).toBe(200)
    expect(res._isEndCalled()).toBeTruthy()
    expect(res._getJSONData()).toStrictEqual({ products: { size: 2, products } })
  })

  it('should return a response code of 400 and a json error from malformed data', async () => {
    req.body.filters = {
      price: [0, 4.99]
    }
    let errorMessage = { error: 'Products not found.' }
    let rejectedPromise = Promise.reject(errorMessage)
    EcommerceProduct.find.mockImplementation(() => ({
      select: jest.fn().mockImplementation(() => ({
        populate: jest.fn().mockImplementation(() => ({
          sort: jest.fn().mockImplementation(() => ({
            skip: jest.fn().mockImplementation(() => ({
              limit: jest.fn().mockResolvedValueOnce(rejectedPromise)
            }))
          }))
        }))
      }))
    }))
    await listProductsBySearch(req, res)
    expect(res.statusCode).toBe(400)
    expect(res._isEndCalled()).toBeTruthy()
    expect(res._getJSONData()).toStrictEqual(errorMessage)
  })

})

describe('productController.listProductsByUserSearch', () => {

  it('should be a function', () => {
    expect(typeof listProductsByUserSearch).toBe('function')
  })

  it('should not return a status code 400 and an error json if no query is included with the request', async () => {
    let errorMessage = { error: 'Search query is required.' }
    req.query.search = undefined
    await listProductsByUserSearch(req, res)
    expect(res.statusCode).toBe(400)
    expect(res._isEndCalled()).toBeTruthy()
    expect(res._getJSONData()).toStrictEqual(errorMessage)
  })

  it('should call EcommerceProduct.find with a search object built from the query', async () => {
    let searchObjectInstance = {
      name: {
        $regex: 'test',       //create a regex based on the search input from the user
        $options: 'i'
      },
      category: 'test'
    }
    req.query.search = 'test'
    req.query.category = 'test'
    await listProductsByUserSearch(req, res)
    expect(EcommerceProduct.find).toHaveBeenCalledWith(searchObjectInstance)
  })

  it('should return a status code of 200 and a json object with the result', async () => {
    req.query.search = 'test'
    req.query.category = 'test'
    EcommerceProduct.find.mockImplementationOnce(() => ({
      select: jest.fn().mockReturnValue(products)
    }))
    await listProductsByUserSearch(req, res)
    expect(res.statusCode).toBe(200)
    expect(res._isEndCalled()).toBeTruthy()
    expect(res._getJSONData()).toStrictEqual(products)
  })

  it('should not return a status code 400 and an error json on malformed request', async () => {
    req.query.search = 'test'
    req.query.category = 'test'
    let errorMessage = { error: '' }
    let rejectedPromise = Promise.reject(errorMessage)
    EcommerceProduct.find.mockImplementationOnce(() => ({
      select: jest.fn().mockReturnValue(rejectedPromise)
    }))
    await listProductsByUserSearch(req, res)
    expect(res.statusCode).toBe(400)
    expect(res._isEndCalled()).toBeTruthy()
    expect(res._getJSONData()).toStrictEqual(errorMessage)
  })

})

describe('productController.listProductCategories', () => {

  it('should be a function', () => {
    expect(typeof listProductCategories).toBe('function')
  })

  it('should call EcommerceProduct.distinct', async () => {
    let categoryString = 'category'
    let emptyObject = {}
    await listProductCategories(req, res)
    expect(EcommerceProduct.distinct).toBeCalledWith(categoryString, emptyObject)
  })

  it('should return status code 200 and a json of categories that have products in them', async () => {
    EcommerceProduct.distinct.mockReturnValue(categories)
    await listProductCategories(req, res)
    expect(res.statusCode).toBe(200)
    expect(res._isEndCalled()).toBeTruthy()
    expect(res._getJSONData()).toStrictEqual(categories)
  })

  it('should return status code 400 and a json error object on malformed data', async () => {
    const errorMessage = ({ error: 'Categories not found.' })
    const rejectedPromise = Promise.reject(errorMessage)
    EcommerceProduct.distinct.mockReturnValue(rejectedPromise)
    await listProductCategories(req, res)
    expect(res.statusCode).toBe(400)
    expect(res._isEndCalled()).toBeTruthy()
    expect(res._getJSONData()).toStrictEqual(errorMessage)
  })

})

describe('productController.listRelatedProducts', () => {
  
  it('should be a function', () => {
    expect(typeof listRelatedProducts).toBe('function')
  })

  it('should call EcommerceProduct.find.limit.populate', async () => {
    req.product = product
    await listRelatedProducts(req, res)
    expect(EcommerceProduct.find).toBeCalled()
  })

  it('should return status code 200 and a json object with the search results', async () => {
    req.product = product
    EcommerceProduct.find.mockImplementation(() => ({
      limit: jest.fn().mockImplementation(() => ({
        populate: jest.fn().mockResolvedValueOnce(products)
      }))
    }))
    await listRelatedProducts(req, res)
    expect(res.statusCode).toBe(200)
    expect(res._isEndCalled()).toBeTruthy()
    expect(res._getJSONData()).toStrictEqual(products)
  })

  it('should return status code 400 and an error json object on malformed request', async () => {
    req.product = product
    errorMessage = ({ error: 'Products not found.' })
    rejectedPromise = Promise.reject(errorMessage)
    EcommerceProduct.find.mockImplementation(() => ({
      limit: jest.fn().mockImplementation(() => ({
        populate: jest.fn().mockResolvedValueOnce(rejectedPromise)
      }))
    }))
    await listRelatedProducts(req, res)
    expect(res.statusCode).toBe(400)
    expect(res._isEndCalled()).toBeTruthy()
    expect(res._getJSONData()).toStrictEqual(errorMessage)
  })

})

describe('productController.listProducts', () => {

  it('should be a function', () => {
    expect(typeof listProducts).toBe('function')
  })

  it('should call EcommerceProduct.find.select.populate.sort.limit', async () => {
    req.query.limit = 2
    req.query.sortBy = 'name'
    req.query.order = 'desc'
    await listProducts(req, res)
    expect(EcommerceProduct.find).toBeCalled()
  })

  it('should return status code 200 and json with the search results', async () => {
    EcommerceProduct.find.mockImplementation(() => ({
      select: jest.fn().mockImplementation(() => ({
        populate: jest.fn().mockImplementation(() => ({
          sort: jest.fn().mockImplementation(() => ({
            limit: jest.fn().mockResolvedValueOnce(products)
          }))
        }))
      }))
    }))
    await listProducts(req, res)
    expect(res.statusCode).toBe(200)
    expect(res._isEndCalled()).toBeTruthy()
    expect(res._getJSONData()).toStrictEqual(products)
  })

  it('should return status code 400 and json error for malformed request', async () => {
    let errorMessage = ({ error: 'Product(s) not found.' })
    let rejectedPromise = Promise.reject(errorMessage)
    EcommerceProduct.find.mockImplementation(() => ({
      select: jest.fn().mockImplementation(() => ({
        populate: jest.fn().mockImplementation(() => ({
          sort: jest.fn().mockImplementation(() => ({
            limit: jest.fn().mockResolvedValueOnce(rejectedPromise)
          }))
        }))
      }))
    }))
    await listProducts(req, res)
    expect(res.statusCode).toBe(400)
    expect(res._isEndCalled()).toBeTruthy()
    expect(res._getJSONData()).toStrictEqual(errorMessage)
  })

})

describe('productController.deleteProduct', () => {

  it('should be a function', () => {
    expect(typeof deleteProduct).toBe('function')
  })

  it('should call product.remove', async () => {
    req.product = productInstance
    await deleteProduct(req, res)
    expect(productInstance.remove).toBeCalled()
  })

  it('should return a status of 200 and a success json object', async () => {
    req.product = productInstance
    let resolvedPromise = Promise.resolve('delete')
    productInstance.remove.mockResolvedValue(resolvedPromise)
    await deleteProduct(req, res)
    expect(res.statusCode).toBe(200)
    expect(res._isEndCalled()).toBeTruthy()
    expect(res._getJSONData()).toStrictEqual({ message: 'Product deleted successfully.' })
  })

  it('should handle errors with a reponse status of 400 and a json error', async () => {
    req.product = productInstance
    const errorMessage = { error: '' }
    const rejectedPromise = Promise.reject(errorMessage)
    productInstance.remove.mockReturnValue(rejectedPromise)
    await deleteProduct(req, res)
    expect(res.statusCode).toBe(400)
    expect(res._isEndCalled()).toBeTruthy()
    expect(res._getJSONData()).toStrictEqual(errorMessage)
  })

})

describe('productController.updateProduct', () => {

  beforeEach(() => {
    fields = product
    files = {}
    form = new formidable.IncomingForm()
    form.parse.mockImplementation((req, callback) => {
      originalCallback = callback
    })
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('should be a function', () => {
    expect(typeof updateProduct).toBe('function')
  })

  it('should parse an incoming form with formidable', async () => {
    await updateProduct(req, res)
    expect(form.parse).toBeCalled()
    expect(form.keepExtensions).toBe(true)
  })

  it('should return a status code of 400 and a json error object on a form parse error', async () => {
    let err = 'error'
    await updateProduct(req, res)
    await originalCallback(err, fields, files)
    expect(res.statusCode).toBe(400)
    expect(res._isEndCalled()).toBeTruthy()
    expect(res._getJSONData()).toStrictEqual({ error: 'Image could not be uploaded.' })
  })

  it('should merge the edits onto the product via lodash.extend', async () => {
    req.product = product
    await updateProduct(req, res)
    await originalCallback(undefined, fields, files)
    expect(lodash.extend).toBeCalledWith(product, fields)
  })

  it('should return a status code of 201 and the product json object if successful', async () => {
    lodash.extend.mockImplementation(() => {
        return {
          product,
          save: () => {
            return product
          }
        }
    })
    await updateProduct(req, res)
    await originalCallback(undefined, fields, files)
    expect(res.statusCode).toBe(201)
    expect(res._isEndCalled()).toBeTruthy()
    expect(res._getJSONData()).toBeTruthy()
  })

  it('should return a status code of 400 and a json error object for malformed request', async () => {
    lodash.extend.mockImplementation(() => {
      return {
        product,
        save: () => {
          throw new Error({ error: ''})
        }
      }
    })
    await updateProduct(req, res)
    await originalCallback(undefined, fields, files)
    expect(res.statusCode).toBe(400)
    expect(res._isEndCalled()).toBeTruthy()
    expect(res._getJSONData()).toStrictEqual({ error: '' })
  })

  it('should save a photo to the model if one is included in the form', async () => {
    product.photo = {}
    lodash.extend.mockImplementation(() => {
      return product
    })
    files.photo = {}
    files.photo.type = 'jpg'
    files.photo.size = 1
    files.photo.path = 'Z:/test/jest.jpg'
    fs.readFileSync.mockReturnValue(files.photo.path)
    await updateProduct(req, res)
    await originalCallback(undefined, fields, files)
    expect(fs.readFileSync).toBeCalled()
    expect(product.photo.data).toBe(files.photo.path)
    expect(product.photo.contentType).toBe(files.photo.type)
  })

  it('should reject a photo that is too large', async () => {
    lodash.extend.mockImplementation(() => {
      return product
    })
    files.photo = {}
    files.photo.size = 1000001
    await updateProduct(req, res)
    await originalCallback(undefined, fields, files)
    expect(res.statusCode).toBe(400)
    expect(res._isEndCalled()).toBeTruthy()
    expect(res._getJSONData()).toStrictEqual({ error: 'Image should be less than 1mb in size.' })
  })

})

describe('productController.readProduct', () => {

  it('should be a function', () => {
    expect(typeof readProduct).toBe('function')
  })

  it('should return a reponse status of 200 and the product in json format - without the photo', async () => {
    req.product = product
    await readProduct(req, res)
    expect(req.product.photo).toBe(undefined)
    expect(res.statusCode).toBe(200)
    expect(res._isEndCalled()).toBeTruthy()
    expect(res._getJSONData()).toBeTruthy()
  })

})

describe('productController.productById', () => {
  
  it('should be a function', () => {
    expect(typeof productById).toBe('function')
  })

  it('should call EcommerceProduct.findById with route params', async () => {
    EcommerceProduct.findById.mockImplementation(() => ({
      populate: jest.fn()
    }))
    await productById(req, res, next, id)
    expect(EcommerceProduct.findById).toHaveBeenCalledWith(id)
  })

  it('should attach the product to the request and call next', async () => {
    EcommerceProduct.findById.mockImplementationOnce(() => ({
      populate: jest.fn().mockResolvedValueOnce(product)
    }))
    await productById(req, res, next, id)
    expect(req.product).toStrictEqual(product)
    expect(next).toBeCalled()
  })

  it('should respond with a status code of 404 and an error json if the product does not exist', async () => {
    EcommerceProduct.findById.mockImplementationOnce(() => ({
      populate: jest.fn().mockResolvedValueOnce(null)
    }))
    await productById(req, res, next, id)
    expect(res.statusCode).toBe(404)
    expect(res._isEndCalled()).toBeTruthy()
    expect(res._getJSONData()).toStrictEqual({ error: 'Product not found.' })
  })

  it('should handle errors with a reponse status of 400 and a json error', async () => {
    let errorMessage = { error: '' }
    let rejectedPromise = Promise.reject(errorMessage)
    EcommerceProduct.findById.mockImplementationOnce(() => ({
      populate: jest.fn().mockResolvedValueOnce(rejectedPromise)
    }))
    await productById(req, res, next, id)
    expect(res.statusCode).toBe(400)
    expect(res._isEndCalled()).toBeTruthy()
    expect(res._getJSONData()).toStrictEqual(errorMessage)
  })

})

describe('productController.createProduct', () => {

  beforeEach(() => {
    fields = product
    files = {}
    form = new formidable.IncomingForm()
    form.parse.mockImplementation((req, callback) => {
      originalCallback = callback
    })
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  afterAll(() => {
    jest.resetAllMocks()
  })

  it('should be a function', () => {
    expect(typeof createProduct).toBe('function')
  })

  it('should parse an incoming form with formidable', async () => {
    await createProduct(req, res)
    expect(form.parse).toBeCalled()
    expect(form.keepExtensions).toBe(true)
  })

  it('should return a status code of 400 and a json error object on a form parse error', async () => {
    let err = 'error'
    await createProduct(req, res)
    await originalCallback(err, fields, files)
    expect(res.statusCode).toBe(400)
    expect(res._isEndCalled()).toBeTruthy()
    expect(res._getJSONData()).toStrictEqual({ error: 'Image could not be uploaded.' })
  })

  it('should create a new product with new EcommerceProduct', async () => {
    await createProduct(req, res)
    await originalCallback(undefined, fields, files)
    expect(EcommerceProduct).toBeCalled()
    expect(form.parse).toHaveBeenCalledWith(req, expect.any(Function))
  })

  it('should return a status code of 201 and the product json object if successful', async () => {
    EcommerceProduct.mockImplementation(() => {
        return {
          product,
          save: () => {
            return product
          }
        }
    })
    await createProduct(req, res)
    await originalCallback(undefined, fields, files)
    expect(res.statusCode).toBe(201)
    expect(res._isEndCalled()).toBeTruthy()
    expect(res._getJSONData()).toBeTruthy()
  })

  it('should return a status code of 400 and a json error object for malformed request', async () => {
    EcommerceProduct.mockImplementation(() => {
      return {
        product,
        save: () => {
          throw new Error({ error: ''})
        }
      }
    })
    await createProduct(req, res)
    await originalCallback(undefined, fields, files)
    expect(res.statusCode).toBe(400)
    expect(res._isEndCalled()).toBeTruthy()
    expect(res._getJSONData()).toStrictEqual({ error: '' })
  })

  it('should save a photo to the model if one is included in the form', async () => {
    product.photo = {}
    EcommerceProduct.mockImplementation(() => {
      return product
    })
    files.photo = {}
    files.photo.type = 'jpg'
    files.photo.size = 1
    files.photo.path = 'Z:/test/jest.jpg'
    fs.readFileSync.mockReturnValue(files.photo.path)
    await createProduct(req, res)
    await originalCallback(undefined, fields, files)
    expect(fs.readFileSync).toBeCalled()
    expect(product.photo.data).toBe(files.photo.path)
    expect(product.photo.contentType).toBe(files.photo.type)
  })

  it('should reject a photo that is too large', async () => {
    EcommerceProduct.mockImplementation(() => {
      return product
    })
    files.photo = {}
    files.photo.size = 1000001
    await createProduct(req, res)
    await originalCallback(undefined, fields, files)
    expect(res.statusCode).toBe(400)
    expect(res._isEndCalled()).toBeTruthy()
    expect(res._getJSONData()).toStrictEqual({ error: 'Image should be less than 1mb in size.' })
  })

})