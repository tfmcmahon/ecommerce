const express = require('express')
const router = express.Router()

const { 
    createProduct,
    productById,
    readProduct,
    deleteProduct,
    updateProduct
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

// @route   GET api/product/create/productId
// @desc    Read a product
// @access  Public
router.get('/product/:productId', readProduct)

// @route   DELETE api/product/productId/userId
// @desc    Read a product
// @access  Admin
router.delete('/product/:productId/:userId', requireSignin, isAuth, isAdmin, deleteProduct)

// @route   PUT api/product/productId/userId
// @desc    Edit a product
// @access  Admin
router.put('/product/:productId/:userId', requireSignin, isAuth, isAdmin, updateProduct)


// @route   none
// @desc    check params for a user id or product id
// @access  NA
router.param('userId', userById)
router.param('productId', productById)

module.exports = router 