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
const authRoute = require('./routes/authRoute')
const userRoute = require('./routes/userRoute')
const categoryRoute = require('./routes/categoryRoute')
const productRoute = require('./routes/productRoute')
const braintreeRoute = require('./routes/braintreeRoute')

//define app
const app = express()

//database
mongoose.connect(process.env.DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
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

//listener
const port = process.env.PORT || 8000
app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})