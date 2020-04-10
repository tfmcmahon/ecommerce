const express = require('express')
const router = express.Router()

const {
    createProduct,
    readProduct,
    updateProduct,
    deleteProduct,
    productById,
    listProducts,
    listRelatedProducts,
    listProductCategories,
    listProductsBySearch,
    productPhoto
} = require('../controllers/productController')
const { requireLogin,
    isAuth,
    isAdmin,
} = require('../controllers/authController')
const { userById } = require('../controllers/userController')

// @route   POST api/product/create/userId
// @desc    Create a product
// @access  Admin
router.post('/product/create/:userId', requireLogin, isAuth, isAdmin, createProduct)

// @route   GET api/product/productId
// @desc    Read a product
// @access  Public
router.get('/product/:productId', readProduct)

// @route   PUT api/product/productId/userId
// @desc    Update a product
// @access  Admin
router.put('/product/:productId/:userId', requireLogin, isAuth, isAdmin, updateProduct)

// @route   DELETE api/product/productId/userId
// @desc    Delete a product
// @access  Admin
router.delete('/product/:productId/:userId', requireLogin, isAuth, isAdmin, deleteProduct)

// @route   GET api/products
// @desc    List products by query
// @access  Public
router.get('/products', listProducts)

// @route   GET api/products/realted/productId
// @desc    List products that are related to a product param
// @access  Public
router.get('/products/related/:productId', listRelatedProducts)

// @route   GET api/products/categories
// @desc    List products that are in a category
// @access  Public
router.get('/products/categories', listProductCategories)

// @route   POST api/products/search
// @desc    List products per search
// @access  Public
router.post('/products/search', listProductsBySearch)

// @route   GET api/product/photo/productId
// @desc    Get the product photo
// @access  Public
router.get('/products/photo/:productId', productPhoto)

// @route   none
// @desc    check params for a user id or product id
// @access  NA
router.param('userId', userById)
router.param('productId', productById)

module.exports = router 