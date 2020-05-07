const formidable = require('formidable')
const lodash = require('lodash')
const fs = require('fs')
const EcommerceProduct = require('../models/productModel')
const { errorHandler } = require('../helpers/dbErrorHandler')

//whenever there is a productId in paramaters, attach it to the request
exports.productById = async (req, res, next, id) => {
    try {
        const product = await EcommerceProduct.findById(id).populate('category')
        if (!product) {
            return res.status(404).json({ error: 'Product not found.' }) 
        }
        req.product = product
        next()
    } catch (err) {
        res.status(400).json({ error: errorHandler(err) }) 
    }
}

exports.createProduct = async (req, res) => {
    let form = new formidable.IncomingForm()
    form.keepExtensions = true
    form.parse(req, async (err, fields, files) => {
        if (err) {
            return res.status(400).json({ error: 'Image could not be uploaded.' })
        }
        let product = new EcommerceProduct(fields)

        //photo handling
        if (files.photo) {
            //limit maximum file size
            if (files.photo.size > 1000000) {
                return res.status(400).json({ error: 'Image should be less than 1mb in size.' })
            }
            product.photo.data = fs.readFileSync(files.photo.path)
            product.photo.contentType = files.photo.type
        }

        try {
            const data = await product.save()
            res.status(201).json({ data })
        } catch (err) {
            res.status(400).json({ error: errorHandler(err) })
        }
    })
}

exports.readProduct = async (req, res) => {
    //remove the photo from the product
    if (req.product.photo) {
        req.product.photo = undefined
    }
    await res.status(200).json(req.product)
}

exports.updateProduct = async (req, res) => {

    let form = new formidable.IncomingForm()
    form.keepExtensions = true
    form.parse(req, async (err, fields, files) => {
        if (err) {
            return res.status(400).json({ error: 'Image could not be uploaded.' })
        }

        //update the product
        let product = req.product
        product = lodash.extend(product, fields)

        //photo handling
        if (files.photo) {
            //limit maximum file size
            if (files.photo.size > 1000000) {
                return res.status(400).json({ error: 'Image should be less than 1mb in size.' })
            }
            product.photo.data = fs.readFileSync(files.photo.path)
            product.photo.contentType = files.photo.type
        }

        try {
            const data = await product.save()
            res.status(201).json({ data })
        } catch (err) {
            res.status(400).json({ error: errorHandler(err) })
        }
    })
}

exports.deleteProduct = async (req, res) => {
    try {
        let product = req.product
        await product.remove()
        res.status(200).json({ message: 'Product deleted successfully.' })
    } catch (err) {
        res.status(400).json({ error: errorHandler(err) })
    }
}

/*************************************************************

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

************************************************************/

exports.listProducts = async (req, res) => {
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

    let sortObject = {
        [sortBy]: order
    }

    try {
        const products = await EcommerceProduct
            .find()
            .select('-photo')                       //remove the photos to save loading time
            .populate('category')                   //adds the category, we can do this since we defined category in the product shcema
            .sort(sortObject)                       //sort the result by the queries
            .limit(limit)                           //limit the amount of results
        res.status(200).json(products)
    } catch (err) {
        res.status(400).json({ error: 'Product(s) not found.' })
    }
}

//find products based on the requested product's category
exports.listRelatedProducts = async (req, res) => {
    //check queries, assign defaults if none
    let limit = req.query.limit
        ? parseInt(req.query.limit)
        : 6

        try {
            const products = await EcommerceProduct
                .find({ 
                    _id: { $ne: req.product },               //find products that are not the requested product (ne = not equal to)
                    category: req.product.category           //search by matching category
                })
                .limit(limit)
                .populate('category', '_id name')
            res.status(200).json(products)    
        } catch (err) {
            res.status(400).json({ error: 'Products not found.' })
        }
}

//List categories with products in them
exports.listProductCategories = async (req, res) => {
    try {
        const categories = await EcommerceProduct.distinct('category', {})
        res.status(200).json(categories)
    } catch (err) {
        res.status(400).json({ error: 'Categories not found.' })
    }
}


exports.listProductsBySearch = async (req, res) => {
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
        [sortBy]: order
    }
 
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
 
    try {
        const products = await EcommerceProduct.find(findArgs)
            .select('-photo')
            .populate('category')
            .sort(sortObject)
            .skip(skip)
            .limit(limit)
        res.status(200).json({ size: products.length, products })   
    } catch (err) {
        res.status(400).json({ error: 'Products not found.' })
    }
}

exports.productPhoto = (req, res, next) => {
    if (req.product.photo.data) {
        res.set('Content-Type', req.product.photo.contentType)
        return res.send(req.product.photo.data)
    }
    next()
}

exports.listProductsByUserSearch = async (req, res) => {
    //create object to hold search input and category select
    const searchObject = {}
    //assign search input to query.name and category value to query.category
    if (!req.query.search) {
        return res.status(400).json({ error: 'Search query is required.' })
    } else {
        searchObject.name = {
            $regex: req.query.search,       //create a regex based on the search input from the user
            $options: 'i'                   //ignore case
        }
        if (req.query.category && req.query.category != 'All') {
            searchObject.category = req.query.category
        }
        // perform a db search with the search object (remove photo for loading speed)
        try {
            const products = await EcommerceProduct.find(searchObject).select('-photo')
            res.status(200).json(products)
        } catch (err) {
            res.status(400).json({ error: errorHandler(err) })
        }
    }
}

exports.updateQuantityAndSold = async (req, res, next) => {
    //map through all of the products in the order (attached to the request) 
    //in order to get the DB update options for each one
    let bulkOptions = req.body.order.products.map((product) => {
        return {
            updateOne: {
                filter: { _id: product._id },       //get the product by id
                update: {                           //define update fields ...
                    $inc: {                         //includes ...
                        quantity: -product.count,   //quantity (decrement by count)
                        sold: +product.count        //sold (increment by count)
                    } 
                }
            }
        }
    })

    try {
        await EcommerceProduct.bulkWrite(bulkOptions, {})
        next()
    } catch (err) {
        res.status(400).json({ error: 'Could not update product.' })
    }
}