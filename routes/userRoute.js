const express = require('express')
const router = express.Router()

const { requireSignin,
    isAuth,
    isAdmin,
} = require('../controllers/authController')
const { userById } = require('../controllers/userController')

// @route   GET api/user/secret/:userId
// @desc    test route
// @access  Public
router.get('/user/secret/:userId', requireSignin, isAuth, isAdmin, (req, res) => {
   res.json({
       user: req.profile
   }) 
})

// @route   none
// @desc    check params for a user id
// @access  NA
router.param('userId', userById)

module.exports = router 