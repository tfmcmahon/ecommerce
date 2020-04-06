const EcommerceUser = require('../models/userModel')

exports.userById = (req, res, next, id) => {
    //look for the user with the id parameter
    EcommerceUser.findById(id).exec((err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: 'User not found.'
            })
        }
        req.profile = user
        next()
    })
}