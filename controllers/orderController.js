const { EcommerceOrder } = require('../models/orderModel')
const { errorHandler } = require('../helpers/dbErrorHandler')


//orderId param checker method
exports.orderById = async (req, res, next, id) => {
    try {
        const order = await  EcommerceOrder.findById(id)
            .populate('products.product', 'name price') //return the products, name, and price from the order schema
        if (!order) {
            return res.status(404).json({ error: 'Order not found.' }) 
        }
        req.order = order    
        next()  
    } catch (err) {
        res.status(400).json({ error: errorHandler(err) }) 
    }
}

exports.createOrder = async (req, res) => {
    //attach the user onto the request (we have this info from our userId param checker ...
    //... which grabs userId from paramaters and then returns the profile from the DB)
    //we need this to satisfy our model requirements
    req.body.order.user = req.profile
    try {
        const data = await EcommerceOrder.create(req.body.order)
        res.status(201).json(data)
    } catch (err) {
        res.status(500).json({ error: errorHandler(err) })
    }
}

exports.listOrders = async (req, res) => {
    try {
        const orders = await EcommerceOrder.find()
            .populate('user', '_id name address')   //get the corresponding user and their info
            .sort('-created')
        res.status(200).json(orders)   
    } catch (err) {
        res.status(400).json({ error: errorHandler(err) })
    }
}

exports.getOrderStatus = async (req, res) => {
    //get the enum values from the order schema
    await res.json(
        EcommerceOrder
            .schema
            .path('status')
            .enumValues
    )
}

exports.updateOrderStatus = async (req, res) => {
    //get the order by id (from front-end)
    const order = await EcommerceOrder.updateOne(
        { _id: req.order._id },
        { $set: { status: req.body.status } },     //update the status
        {
            new: true,
            useFindAndModify: false
        }
    )
    if (order.nModified < 1) {
        return res.status(400).json({ error: 'Could not update order' })
    }
    res.status(200).json(order)             //send the mongoose info back
}
