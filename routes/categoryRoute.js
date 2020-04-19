const express = require('express')
const router = express.Router()

const {
    createCategory,
    readCategory,
    updateCategory,
    deleteCategory,
    categoryById,
    listAllCategories
} = require('../controllers/categoryController')
const { 
    requireLogin,
    isAuth,
    isAdmin,
} = require('../controllers/authController')
const { userById } = require('../controllers/userController')

// @route   POST api/category/create/userId
// @desc    Create a category
// @access  Admin
router.post('/category/create/:userId', requireLogin, isAuth, isAdmin, createCategory)

// @route   GET api/category/create/userId
// @desc    Read a category
// @access  Public
router.get('/category/:categoryId', readCategory)

// @route   PUT api/category/categoryId/userId
// @desc    Update a category
// @access  Admin
router.put('/category/:categoryId/:userId', requireLogin, isAuth, isAdmin, updateCategory)

// @route   DELETE api/category/categoryId/userId
// @desc    Delete a category
// @access  Admin
router.delete('/category/:categoryId/:userId', requireLogin, isAuth, isAdmin, deleteCategory)

// @route   GET api/category/all
// @desc    List all categories
// @access  Public
router.get('/categories/all', listAllCategories)

// @route   none
// @desc    check params for a user id or category id
// @access  NA
router.param('userId', userById)
router.param('categoryId', categoryById)

module.exports = router 