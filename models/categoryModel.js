const mongoose = require('mongoose')

//category
const categorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            maxlength: 32,
            required: [true, 'Name field is required.']
        }
    }, 
    { timestamps: true }
)

module.exports = mongoose.model('EcommerceCategory', categorySchema)