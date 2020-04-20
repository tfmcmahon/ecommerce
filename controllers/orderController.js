const { EcommerceCartItem, EcommerceOrder } = require('../models/orderModel')
const { errorHandler } = require('../helpers/dbErrorHandler')

exports.createOrder = (req, res) => {
    //attach the user onto the request (we have this info from our userId param checker ...
    //... which grabs userId from paramaters and then returns the profile from the DB)
    //we need this to satisfy our model requirements
    req.body.order.user = req.profile
    const order = new EcommerceOrder(req.body.order)
    order.save((err, data) => {
        if (err) {
            return res.status(400)
                      .json({
                          error: errorHandler(err)
                      })
        }
        res.json(data)
    })
}

exports.listOrders = (req, res) => {
    EcommerceOrder.find()
        .populate('user', '_id name address')   //get the corresponding user and their info
        .sort('-created')
        .exec((err, orders) => {
            if (err) {
                return res.status(400)
                          .json({
                              error: errorHandler(err)
                          })
            }
            res.json(orders)
        })
}