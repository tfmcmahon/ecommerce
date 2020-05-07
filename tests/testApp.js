//package setup
require('dotenv').config()
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const expressValidator = require('express-validator')

//import routes
const authRoute = require('../routes/authRoute')
const userRoute = require('../routes/userRoute')
const categoryRoute = require('../routes/categoryRoute')
const productRoute = require('../routes/productRoute')
const braintreeRoute = require('../routes/braintreeRoute')
const orderRoute = require('../routes/orderRoute')

//define app
const testApp = express()

//leave out the database in this test app file -- 
//we are using local instances of the db to avoid writing over or deleting our live database

//database
// mongoose.connect(process.env.DB, {
//     useNewUrlParser: true,
//     useCreateIndex: true,
//     useUnifiedTopology: true,
//     useFindAndModify: false
// })
// .then(() => console.log('DB connected'))

//middleware
testApp.use(cors())
testApp.use(morgan('dev'))
testApp.use(bodyParser.json())
testApp.use(cookieParser())
testApp.use(expressValidator())

//routes
testApp.use('/api', authRoute)
testApp.use('/api', userRoute)
testApp.use('/api', categoryRoute)
testApp.use('/api', productRoute)
testApp.use('/api', braintreeRoute)
testApp.use('/api', orderRoute)

module.exports = testApp