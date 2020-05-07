const EcommerceCategory = require('../models/categoryModel')
const { errorHandler } = require('../helpers/dbErrorHandler')

//whenever there is a category id param, attach it to the request
exports.categoryById = async (req, res, next, id) => {
    try {
        const category = await EcommerceCategory.findById(id)
        if (!category) {
            return res.status(404).json({ error: 'Category does not exist.'})
        }
        req.category = category
        next()
    } catch (err) {
        res.status(400).json({ error: errorHandler(err)} )
    }
}

exports.createCategory = async (req, res) => {
    try {
        const data = await EcommerceCategory.create(req.body)
        res.status(201).json({ data })
    } catch (err) {
        res.status(500).json({ error: errorHandler(err)} )
    }
}

exports.readCategory = async (req, res) => {
    await res.status(200).json(req.category)
}

exports.updateCategory = async (req, res) => {
    try {
        const newCategory = req.category
        newCategory.name = req.body.name
        const data = await EcommerceCategory.findByIdAndUpdate(
            newCategory._id, 
            newCategory, 
            {
                new: true,
                useFindAndModify: false
            }
        )
        res.status(200).json({ data })
    } catch (err) {
        res.status(400).json({ error: errorHandler(err) })
    }
}

exports.deleteCategory = async (req, res) => {
    try {
        const category = req.category
        category.name = req.body.name
        await EcommerceCategory.deleteOne({ name: category.name })
        res.status(200).json({ message: 'Category deleted successfully.' })
    } catch (err) {
        res.status(400).json({ error: errorHandler(err) })
    }
}

exports.listAllCategories = async (req, res) => {
    try {
        const data = await EcommerceCategory.find().sort('name')
        res.status(200).json({ data })
    } catch (err) {
        res.status(400).json({ error: errorHandler(err)} )
    }
}
