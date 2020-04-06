const jwt = require('jsonwebtoken')
const expressJwt = require('express-jwt')
const EcommerceUser = require('../models/userModel')
const { errorHandler } = require('../helpers/dbErrorHandler')

exports.signup = (req, res) => {
    const user = new EcommerceUser(req.body)
    user.save((err, user) => {
        //on error, send to the error helper to generate db error message
        if (err) {
            return res.status(400)
                      .json({
                            err: errorHandler(err)
                      })
        }
        user.salt = undefined
        user.hashedPassword = undefined
        res.json({
            user
        })
    })
}

exports.signin = (req, res) => {
    //find by email
    const { email, password } = req.body
    EcommerceUser.findOne({ email }, (err, user) => {
        //on error or no user, reply accordingly
        if (err || !user) {
            return res.status(400)
                      .json({
                          error: 'Email does not exist.'
                      })
        }
        //if the user is found, check that the password matches
        if(!user.authenticate(password)) {
            return res.status(401).json({
                error: 'Email and password do not match.'
            })
        }

        //generate a signed token with user id and secret
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET)

        //set the token as a cookie with an expiration time
        res.cookie('json web token', token, { expire: new Date() + 9999 })

        //respond with the user and token to the front end
        const { _id, name, email, role } = user
        return res.json({
            token,
            user: { _id, email, name, role }
        })
    })
}

exports.signout = (req, res) => {
    //clear the cookie
    res.clearCookie('json web token')
    res.json({
        message: 'Signed out successfully.'
    })
}

exports.requireSignin = expressJwt({
    secret: process.env.JWT_SECRET,
    userProperty: 'auth'
})