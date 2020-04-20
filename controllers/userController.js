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
        //attach the user profile to the request
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
        req.body.role = 0;          // role will always be 0
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

exports.addOrderToUserHistory = (req, res, next) => {
    let history = []
    //grab the order (products) from the body, push each product into the history
    req.body.order.products.forEach((product) => {
        history.push({
            _id: product._id,
            name: product.name,
            description: product.description,
            category: product.category,
            quantity: product.count,
            transactionId: req.body.order.transactionId,
            amount: req.body.order.amount           //we need the total amount incase of multiple items (instead of price)
        })
    })
    EcommerceUser.findOneAndUpdate(
        { _id: req.profile._id },
        { $push: { history: history } },
        { new: true },
        (err, user) => {
            if (err) {
                return res.status(400)
                          .json({
                              error: 'Could not update user purchase history'
                          })
            }
            next()
        }
    )
}