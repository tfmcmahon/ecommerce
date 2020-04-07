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