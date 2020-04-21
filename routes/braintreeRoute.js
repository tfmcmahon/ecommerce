const express = require('express')
const router = express.Router()

const { requireLogin, isAuth } = require('../controllers/authController')
const { userById } = require('../controllers/userController')
const { generateToken, processPayment } = require('../controllers/braintreeController')


// @route   GET api/braintree/getToken/userId
// @desc    get a token from braintree
// @access  Private
router.get('/braintree/getToken/:userId', requireLogin, isAuth, generateToken)

// @route   POST api/braintree/getToken/userId
// @desc    process payment
// @access  Private
router.post('/braintree/payment/:userId', requireLogin, isAuth, processPayment)

// @route   contains :userId
// @desc    check params for a user id
// @access  NA
router.param('userId', userById)

module.exports = router