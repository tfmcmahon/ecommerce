const express = require('express')
const router = express.Router()

const { requireLogin, isAuth, isAdmin } = require('../controllers/authController')
const { userById, addOrderToUserHistory } = require('../controllers/userController')
const { 
    createOrder, 
    listOrders, 
    getOrderStatus, 
    updateOrderStatus,
    orderById
} = require('../controllers/orderController')
const { updateQuantityAndSold } = require('../controllers/productController')

// @route   POST api/order/create/userId
// @desc    create an order
// @access  Private
router.post(
    '/order/create/:userId', 
    requireLogin, 
    isAuth, 
    addOrderToUserHistory, 
    updateQuantityAndSold,
    createOrder
)

// @route   GET api/orders/list/userId
// @desc    list all orders
// @access  Admin
router.get(
    '/orders/list/:userId', 
    requireLogin, 
    isAuth, 
    isAdmin,
    listOrders
)

// @route   GET api/orders/status/userId
// @desc    list all orders
// @access  Admin
router.get(
    '/orders/status/:userId', 
    requireLogin, 
    isAuth, 
    isAdmin,
    getOrderStatus
)

// @route   PUT api/orders/:orderId/status/userId
// @desc    list all orders
// @access  Admin
router.put(
    '/orders/:orderId/status/:userId', 
    requireLogin, 
    isAuth, 
    isAdmin,
    updateOrderStatus
)

// @route   contains :userId or :orderId
// @desc    check params for a user id or an order id
// @access  NA
router.param('userId', userById)
router.param('orderId', orderById)

module.exports = router