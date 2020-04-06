const express = require('express')
const router = express.Router()

const { requireSignin } = require('../controllers/authController')
const { userById } = require('../controllers/userController')

// @route   GET user/secret/:userId
// @desc    test route
// @access  Public
router.get('/secret/:userId', requireSignin, (req, res) => {
   res.json({
       user: req.profile
   }) 
})

// @route   none
// @desc    check params for a user id
// @access  Public
router.param('userId', userById)

module.exports = router 