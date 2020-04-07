const EcommerceCategory = require('../models/categoryModel')
const { errorHandler } = require('../helpers/dbErrorHandler') //remove if above works

//whenever there is a category id param, attach it to the request
exports.categoryById = (req, res, next, id) => {
    EcommerceCategory.findById(id)
                    .exec((err, category) => {
                        //if there is an error or no prouct, return an error message
                        if (err || !category) {
                            return res.status(400).json({
                                error: 'Category not found.'
                            })
                        }
                        //otherwise put the product into the request
                        req.category = category
                        next()
                    })
}

exports.createCategory = (req, res) => {
    const category = new EcommerceCategory(req.body)
    category.save((err, data) => {
        if (err) {
            return res.status(400)
                      .json({
                          error: errorHandler(err)
                      })
        }
        res.json({ data })
    })
}

exports.readCategory = (req, res) => {
    return res.json(req.category)
}

exports.updateCategory = (req, res) => {
    const category = req.category
    category.name = req.body.name
    //save the category
    category.save((err, data) => {
        if (err) {
            return res.status(400)
                      .json({
                          error: errorHandler(err)
                      })
        }
        res.json({ data })
    })
}

exports.deleteCategory = (req, res) => {
    const category = req.category
    category.name = req.body.name
    //remove the category
    category.remove((err, data) => {
        if (err) {
            return res.status(400)
                      .json({
                          error: errorHandler(err)
                      })
        }
        res.json({
            message: 'Category deleted successfully.'
        })
    })
}

exports.listAllCategories = (req, res) => {
    EcommerceCategory.find()
                     .exec((err, data)=> {
                         if (err) {
                            return res.status(400)
                            .json({
                                error: errorHandler(err)
                            })
                        }
                        res.json({ data })
                     })
}
