const express = require('express')
const router = express.Router()

const { 
    createCategory
} = require('../controllers/categoryController')
const { requireSignin,
    isAuth,
    isAdmin,
} = require('../controllers/authController')
const { userById } = require('../controllers/userController')

// @route   POST api/category/create/userId
// @desc    Create a category
// @access  Admin
router.post('/category/create/:userId', requireSignin, isAuth, isAdmin, createCategory)

// @route   none
// @desc    check params for a user id
// @access  NA
router.param('userId', userById)

module.exports = router 