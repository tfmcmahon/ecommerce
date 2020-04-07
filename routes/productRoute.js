const express = require('express')
const router = express.Router()

const {
    productById,
    createProduct,
    readProduct,
    updateProduct,
    deleteProduct
} = require('../controllers/productController')
const { requireSignin,
    isAuth,
    isAdmin,
} = require('../controllers/authController')
const { userById } = require('../controllers/userController')

// @route   POST api/product/create/userId
// @desc    Create a product
// @access  Admin
router.post('/product/create/:userId', requireSignin, isAuth, isAdmin, createProduct)

// @route   GET api/product/productId
// @desc    Read a product
// @access  Public
router.get('/product/:productId', readProduct)

// @route   PUT api/product/productId/userId
// @desc    Update a product
// @access  Admin
router.put('/product/:productId/:userId', requireSignin, isAuth, isAdmin, updateProduct)

// @route   DELETE api/product/productId/userId
// @desc    Delete a product
// @access  Admin
router.delete('/product/:productId/:userId', requireSignin, isAuth, isAdmin, deleteProduct)

// @route   none
// @desc    check params for a user id or product id
// @access  NA
router.param('userId', userById)
router.param('productId', productById)

module.exports = router 