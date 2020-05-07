//package setup
require('dotenv').config()
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const expressValidator = require('express-validator')
const path = require('path')

//import routes
const authRoute = require('./routes/authRoute')
const userRoute = require('./routes/userRoute')
const categoryRoute = require('./routes/categoryRoute')
const productRoute = require('./routes/productRoute')
const braintreeRoute = require('./routes/braintreeRoute')
const orderRoute = require('./routes/orderRoute')

//define app
const app = express()

//database
mongoose.connect(process.env.DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})
.then(() => console.log('DB connected'))

//middleware
app.use(cors())
app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(cookieParser())
app.use(expressValidator())

//routes
app.use('/api', authRoute)
app.use('/api', userRoute)
app.use('/api', categoryRoute)
app.use('/api', productRoute)
app.use('/api', braintreeRoute)
app.use('/api', orderRoute)

//serve static assets if in production
if(process.env.NODE_ENV === 'production') {
    //set static folder
    app.use(express.static('client/build'))
    //serve the react app to anything that isn't a back-end route
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    })
}


module.exports = app