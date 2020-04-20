const express = require('express')
const router = express.Router()

const { requireLogin, isAuth, isAdmin } = require('../controllers/authController')
const { userById, addOrderToUserHistory } = require('../controllers/userController')
const { createOrder, listOrders } = require('../controllers/orderController')
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

// @route   none
// @desc    check params for a user id
// @access  NA
router.param('userId', userById)

module.exports = router