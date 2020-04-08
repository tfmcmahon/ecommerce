const formidable = require('formidable')
const lodash = require('lodash')
const fs = require('fs')
const EcommerceProduct = require('../models/productModel')
const { errorHandler } = require('../helpers/dbErrorHandler') //remove if above works

//whenever there is a productId in paramaters, attach it to the request
exports.productById = (req, res, next, id) => {
    EcommerceProduct.findById(id)
                    .exec((err, product) => {
                        //if there is an error or no prouct, return an error message
                        if (err || !product) {
                            return res.status(400).json({
                                error: 'Product not found.'
                            })
                        }
                        //otherwise put the product into the request
                        req.product = product
                        next()
                    })
}

exports.createProduct = (req, res) => {
    let form = new formidable.IncomingForm()
    form.keepExtensions = true
    form.parse(req, (err, fields, files) => {
        //return an error message if one exists
        if (err) {
            return res.status(400)
                      .json({
                          error: 'Image could not be uploaded.'
                      })
        }

        //create the product
        let product = new EcommerceProduct(fields)

        //photo handling
        if (files.photo) {
            //limit maximum file size
            if (files.photo.size > 1000000) {
                return res.status(400)
                          .json({
                              error: 'Image should be less than 1mb in size.'
                          })
            }
            product.photo.data = fs.readFileSync(files.photo.path)
            product.photo.contentType = files.photo.type
        }

        //save the product
        product.save((err, data) => {
            if (err) {
                return res.status(400)
                          .json({
                              error: errorHandler(err)
                          })
            }
            res.json({ data })
        })
    })
}

exports.readProduct = (req, res) => {
    //remove the photo from the product
    if (req.product.photo) {
        req.product.photo = undefined
    }
    return res.json(req.product)
}

exports.updateProduct = (req, res) => {
    let form = new formidable.IncomingForm()
    form.keepExtensions = true
    form.parse(req, (err, fields, files) => {
        //return an error message if one exists
        if (err) {
            return res.status(400)
                      .json({
                          error: 'Image could not be uploaded.'
                      })
        }

        //create the product
        let product = req.product
        product = lodash.extend(product, fields)

        //photo handling
        if (files.photo) {
            //limit maximum file size
            if (files.photo.size > 1000000) {
                return res.status(400)
                          .json({
                              error: 'Image should be less than 1mb in size.'
                          })
            }
            product.photo.data = fs.readFileSync(files.photo.path)
            product.photo.contentType = files.photo.type
        }

        //save the product
        product.save((err, data) => {
            if (err) {
                return res.status(400)
                          .json({
                              error: errorHandler(err)
                          })
            }
            res.json({ data })
        })
    })
}

exports.deleteProduct = (req, res) => {
    let product = req.product
    product.remove((err, deletedProduct) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            })
        }
        res.json({
            message: 'Product deleted successfully.'
        })
    })
}

/* 
                *************************
                * Front end interaction *
                *************************

sort ...

by sales =      /products
                ?sortBy=sold
                &order=desc         //descending order
                &limit=4            //max products to return

by arrivals =   /products
                ?sortBy=createdAt
                &order=desc         //descending order
                &limit=4            //max products to return

... or if no params are sent, then return all products
*/

exports.listProducts = (req, res) => {
    //check queries, assign defaults if none
    let order = req.query.order
        ? req.query.order
        : 'asc'
    let sortBy = req.query.sortBy
        ? req.query.sortBy
        : '_id'
    let limit = req.query.limit
        ? parseInt(req.query.limit)
        : 6

    let sortObject= {
        sortBy: order
    }
        
    EcommerceProduct.find()
                    .select('-photo')                //remove the photos so to save time, we will handle elsewhere
                    .populate('category')            //adds the category, we can do this since we defined category in the product shcema
                    .sort(sortString)                //sort the result by the queries
                    .limit(limit)                    //limit the amount of results
                    .exec((err, products) => {
                        if (err) {
                            return res.status(400)
                                      .json({
                                          error: 'Products not found.'
                                      })
                        }
                        res.json(products)
                    })
}

//find products based on the requested product's category
exports.listRelatedProducts = (req, res) => {
    //check queries, assign defaults if none
    let limit = req.query.limit
        ? parseInt(req.query.limit)
        : 6

    EcommerceProduct.find({ 
                        _id: { $ne: req.product },      //find products that are not the requested product (ne = not equal to)
                        category: req.product.category  //search by matching category
                    })
                    .limit(limit)
                    .populate('category', '_id name')
                    .exec((err, products) => {
                        if (err) {
                            return res.status(400)
                                      .json({
                                          error: 'Products not found.'
                                      })
                        }
                        res.json(products)
                    })
}

//List categories with products in them
exports.listProductCategories = (req, res) => {
    EcommerceProduct.distinct('category', {}, (err, categories) => {
        if (err) {
            return res.status(400)
                      .json({
                          error: 'Categories not found.'
                      })
        }
        res.json(categories)
    })
}


exports.listProductsBySearch = (req, res) => {
    let order = req.body.order 
        ? req.body.order 
        : 'desc'
    let sortBy = req.query.sortBy
        ? req.query.sortBy
        : '_id'
    let limit = req.body.limit 
        ? parseInt(req.body.limit) 
        : 100
    let skip = parseInt(req.body.skip)
    let findArgs = {}

    let sortObject= {
        sortBy: order
    }
 
    // console.log(order, sortBy, limit, skip, req.body.filters);
    // console.log('findArgs', findArgs);
 
    for (let key in req.body.filters) {
        if (req.body.filters[key].length > 0) {
            if (key === 'price') {                      //format the price sorting input
                findArgs[key] = {                       //for each price key
                    $gte: req.body.filters[key][0],     //set the lower bound (gte = greater than price)
                    $lte: req.body.filters[key][1]      //set the upper bound (lte = less than)
                }
            } else {
                findArgs[key] = req.body.filters[key]
            }
        }
    }
 
    EcommerceProduct.find(findArgs)
           .select('-photo')
           .populate('category')
           .sort(sortObject)
           .skip(skip)
           .limit(limit)
           .exec((err, products) => {
               if (err) {
                   return res.status(400).json({
                       error: 'Products not found'
                   })
               }
               res.json({
                   size: products.length,
                   products
               })
           })
}

exports.productPhoto = (req, res, next) => {
    if (req.product.photo.data) {
        res.set('Content-Type', req.product.photo.contentType)
        return res.send(req.product.photo.data)
    }
    next()
}