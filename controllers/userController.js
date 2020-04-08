const EcommerceUser = require('../models/userModel')

//userId param checker method
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

exports.readUser = (req, res) => {
    //remove the hashed password and the salt
    req.profile.hashedPassword = undefined
    req.profile.salt = undefined
    return res.json(req.profile)
}

exports.updateUser = (req, res) => {
    EcommerceUser.findOneAndUpdate(
        { _id: req.profile._id },   //search by the id which our middleware attached to the request
        { $set: req.body },         //update everything from the request body
        { new: true },              //return the new item to the front end
        (err, user) => {
            if (err) {
                return res.status(401)
                          .json({
                              error: 'You are not authorized to perform this action.'
                          })
            }
            user.hashedPassword = undefined
            user.salt = undefined
            return res.json(user)
        }
    )
}