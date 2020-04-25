const express = require('express')
const router = express.Router()

const { 
    register, 
    login, 
    logout
} = require('../controllers/authController')
const { userRegisterValidator } = require('../validators/index')

// @route   POST api/register
// @desc    User sign up
// @access  Public
router.post('/register', userRegisterValidator, register)

// @route   POST api/login
// @desc    User sign in
// @access  Public
router.post('/login', login)

// @route   GET api/logout
// @desc    User sign out
// @access  Public
router.get('/logout', logout)

module.exports = router 