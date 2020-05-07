const jwt = require('jsonwebtoken')
const expressJwt = require('express-jwt')
const EcommerceUser = require('../models/userModel')
const { errorHandler } = require('../helpers/dbErrorHandler')

exports.register = async (req, res) => {
    try {
        const newUser = new EcommerceUser(req.body)
        const user = await newUser.save()
        user.salt = undefined
        user.hashedPassword = undefined
        res.status(201).json({ user })
     } catch (err) {
        res.status(400).json({ error: errorHandler(err) })
    }
}

exports.login = async (req, res) => {
    const { email, password } = req.body
    try {
        //find by email
        const user = await EcommerceUser.findOne({ email })

        //if no user, reply accordingly
        if (!user) {
            return res.status(404).json({ error: 'Email does not exist.' })
        }
        //if the user is found, check that the password matches
        if (!user.authenticate(password)) {
            return res.status(401).json({ error: 'Email and password do not match.' })
        }

        //generate a signed token with user id and secret
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET || '12345' )
        
        //respond with the user and token to the front end
        const { _id, name, role } = user
        res.status(200).json({
            token,
            user: { _id, email, name, role }
        })
    } catch (err) {
        res.status(400).json({ error: errorHandler(err) }) 
    }
}

exports.logout = async (req, res) => {
    //clear the cookie
    await res.clearCookie('json web token')
    await res.status(200).json({ message: 'Signed out successfully.' })
}

//require the user to be signed in
exports.requireLogin = expressJwt({
    secret: process.env.JWT_SECRET || 1234,
    userProperty: 'auth'
})

//require the user id to match the profile id
exports.isAuth = (req, res, next) => {
    // the profile, the auth key (from expressJwt), and the comparison between the two must all be true
    let auth = req.profile && req.auth && req.profile._id == req.auth._id
    //auth will be a boolean -- if the ids don't match or we are missing info return access denied 
    if (!auth) {
        return res.status(403).json({ error: "Access denied." })
    } else {
        next()
    }
}

exports.isAdmin = (req, res, next) => {
    //check the role for admin access
    if (req.profile.role === 0) {
        return res.status(403).json({ error: "This area is for administrators only." })
    } else {
        next()
    }
}