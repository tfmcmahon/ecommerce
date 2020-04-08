const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema

//category
const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            maxlength: 32,
            required: [true, 'Name field is required.']
        },
        description: {
            type: String,
            maxlength: 2000,
            required: [true, 'Description field is required.']
        },
        price: {
            type: Number,
            trim: true,
            maxlength: 32,
            required: [true, 'Price field is required.']
        },
        category: {
            type: ObjectId,
            ref: 'EcommerceCategory',
            required: [true, 'Category field is required.']
        },
        quantity: {
            type: Number,
            required: [true, 'Quantity field is required']
        },
        sold: {
            type: Number,
            default: 0
        },
        photo: {
            data: Buffer,
            contentType: String
        },
        shipping: {
            type: Boolean,
            required: false
        }
    }, 
    { timestamps: true }
)

module.exports = mongoose.model('EcommerceProduct', productSchema)