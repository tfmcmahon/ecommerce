const EcommerceUser = require('../models/userModel')
const { EcommerceOrder } = require('../models/orderModel')
const { errorHandler } = require('../helpers/dbErrorHandler')

//userId param checker method
exports.userById = async (req, res, next, id) => {
    try {
        //look for the user with the id parameter
        const user = await EcommerceUser.findById(id)
        if (!user) {
            return res.status(404).json({ error: 'User not found.' })
        }
        req.profile = user
        next()
    } catch (err) {
        res.status(400).json({ error: errorHandler(err) })
    }
}

exports.readUser = async (req, res) => {
    //remove the hashed password and the salt
    req.profile.hashedPassword = undefined
    req.profile.salt = undefined
    await res.status(200).json(req.profile)
}

exports.updateUser = async (req, res) => {
    req.body.role = 0;              // role will always be 0, prevents users from manually changing their role to admin

    try {
        const user = await EcommerceUser.findOneAndUpdate(
            { _id: req.profile._id },                           //search by the id which our middleware attached to the request
            { $set: req.body },                                 //update everything from the request body
            { new: true, useFindAndModify: false },                                       //return the new item to the front end
        )
        user.hashedPassword = undefined
        user.salt = undefined
        res.status(200).json(user)
    } catch (err) {
        res.status(401).json({ error: 'You are not authorized to perform this action.' })
    }
}

exports.addOrderToUserHistory = async (req, res, next) => {
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
            amount: req.body.order.amount             //we need the total amount incase of multiple items (instead of price)
        })
    })
    try {
        await EcommerceUser.findOneAndUpdate(
            { _id: req.profile._id },
            { $push: { history: history } },
            { new: true, useFindAndModify: false }
        )
        next()
    } catch (err) {
        res.status(400).json({ error: errorHandler(err) })
    }
}

exports.getOrderHistory = async (req, res) => {
    user = req.profile
    try {
        const orders = await EcommerceOrder.find({ user: user._id })
            .populate('user', '_id name')
            .sort('-created')
        res.status(200).json(orders)   
    } catch (err) {
        res.status(400).json({ error: errorHandler(err) })
    }
}