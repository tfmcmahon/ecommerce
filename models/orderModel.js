const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema

const cartItemSchema = new mongoose.Schema(
    {
        product: { 
            type: ObjectId, 
            ref: 'EcommerceProduct'
        },
        name: String,
        price: Number,
        count: Number
    },
    { timestamps: true }
)

const orderSchema = new mongoose.Schema(
    {
        products: [cartItemSchema],
        transactionId: {},
        amount: {
            type: Number
        },
        address: {            
            address1: {
                type: String,
                required: [true, 'Address Line 1 is required.']
            },
            address2: String,
            city: {
                type: String,
                required: [true, 'City is required.']
            },
            state: {
                type: String,
                required: [true, 'State is required.']
            },
            zip: {
                type: Number,
                required: [true, 'Zip Code is required.']
            }
        },
        status: {
            type: String,
            default: 'Not processed',
            enum: ['Not processed', 'Processing', 'Shipped', 'Delivered'] // fixed string options
        },
        updated: Date,
        user: {
            type: ObjectId,
            ref: 'EcommerceUser'
        }
    },
    { timestamps: true }
)

const EcommerceCartItem = mongoose.model('EcommerceCartItem', cartItemSchema)
const EcommerceOrder = mongoose.model('EcommerceOrder', orderSchema)

module.exports = { EcommerceOrder, EcommerceCartItem }