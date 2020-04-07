const EcommerceCategory = require('../models/categoryModel')
const { errorHandler } = require('../helpers/dbErrorHandler') //remove if above works

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