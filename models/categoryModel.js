const mongoose = require('mongoose')

//category
const categorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            maxlength: 32,
            lowercase: true,
            required: [true, 'Name field is required.'],
            unique: [true, 'That category already exists.']
        }
    }, 
    { timestamps: true }
)

module.exports = mongoose.model('EcommerceCategory', categorySchema)