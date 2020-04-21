const { EcommerceCartItem, EcommerceOrder } = require('../models/orderModel')
const { errorHandler } = require('../helpers/dbErrorHandler')


//orderId param checker method
exports.orderById = (req, res, next, id) => {
        //look for the order with the id parameter
        EcommerceOrder.findById(id)
                      .populate('products.product', 'name price') //return the products, name, and price from the order schema
                      .exec((err, order) => {
                          if (err || !order) {
                              return res.status(400).json({
                                  error: 'Order not found.'
                              })
                          }
                          //attach the order to the request
                          req.order = order
                          next()
                      })
}

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

exports.getOrderStatus = (req, res) => {
    //get the enum values from the order schema
    res.json(EcommerceOrder.schema.path('status').enumValues)
}

exports.updateOrderStatus = (req, res) => {
    //get the order by id (from front-end)
    EcommerceOrder.update(
            { _id: req.body.orderId },
            { $set: { status: req.body.status } }, //update the status
            (err, order) => {
                if (err) {
                    return res.status(400)
                              .json({
                                  error: errorHandler(err)
                              })
                }
                res.json(order)                   //send the updated order back
            }
        )
}
