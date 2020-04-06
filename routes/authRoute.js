const express = require('express')
const router = express.Router()

const { signup, 
    signin, 
    signout,
    requireSignin
} = require('../controllers/authController')
const { userSignupValidator } = require('../validators/index')

// @route   POST api/signup
// @desc    User sign up
// @access  Public
router.post('/signup', userSignupValidator, signup)

// @route   POST api/signin
// @desc    User sign in
// @access  Public
router.post('/signin', signin)

// @route   GET api/signout
// @desc    User sign out
// @access  Public
router.get('/signout', signout)

// @route   GET api/hello
// @desc    test protected route
// @access  Public
router.get('/hello', requireSignin, (req, res) => {
    res.send('working')
})

module.exports = router 