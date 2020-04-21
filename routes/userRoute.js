const express = require('express')
const router = express.Router()

const { 
    requireLogin,
    isAuth,
    isAdmin
} = require('../controllers/authController')
const { 
    userById,
    readUser,
    updateUser
 } = require('../controllers/userController')

// @route   GET api/user/secret/:userId
// @desc    test route
// @access  Private
router.get('/user/secret/:userId', requireLogin, isAuth, isAdmin, (req, res) => {
   res.json({
       user: req.profile
   }) 
})

// @route   GET api/user/:userId
// @desc    Get user profile
// @access  Private
router.get('/user/:userId', requireLogin, isAuth, readUser)

// @route   PUT api/user/:userId
// @desc    Update user profile
// @access  Private
router.put('/user/:userId', requireLogin, isAuth, updateUser)

// @route   contains :userId
// @desc    check params for a user id
// @access  NA
router.param('userId', userById)

module.exports = router 