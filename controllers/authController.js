const jwt = require('jsonwebtoken')
const expressJwt = require('express-jwt')
const EcommerceUser = require('../models/userModel')
const { errorHandler } = require('../helpers/dbErrorHandler') //remove if above works

exports.register = (req, res) => {
    const user = new EcommerceUser(req.body)
    user.save((err, user) => {
        //on error, send to the error helper to generate db error message
        if (err) {
            return res.status(400)
                      .json({
                            error: errorHandler(err)
                      })
        }
        user.salt = undefined
        user.hashedPassword = undefined
        res.json({
            user
        })
    })
}

exports.login = (req, res) => {
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

exports.logout = (req, res) => {
    //clear the cookie
    res.clearCookie('json web token')
    res.json({
        message: 'Signed out successfully.'
    })
}

//require the user to be signed in
exports.requireLogin = expressJwt({
    secret: process.env.JWT_SECRET,
    userProperty: 'auth'
})

//require the user id to match the profile id
exports.isAuth = (req, res, next) => {
    // we get the profile & auth keys if the user is authenticated, then compare the ids from each
    let user = req.profile && req.auth && req.profile._id == req.auth._id
    //user will be a boolean -- if the ids don't match return access denied
    if (!user) {
        return res.status(403)
                  .json({
                      error: "Access denied."
                  })
    }
    next()
}

exports.isAdmin = (req, res, next) => {
    //check the role for admin access
    if (req.profile.role === 0) {
        return res.status(403)
                  .json({
                      error: "This area is for administrators only."
                  })
    }
    next()
}