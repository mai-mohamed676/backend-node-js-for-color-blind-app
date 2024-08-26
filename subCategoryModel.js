const mongoose = require('mongoose');

const subCategorySchema = new mongoose.Schema({
    //اول حاجة شكل الاسكيما
    name: {
        type: String,
        trim: true,
        unique: [true, 'Subcategory should be unique'],
        minlength: [2, 'Too short name!!'],
        maxlength: [32, 'Too long name !!'],
    },
    color1: {
        type: String,
        required: true,
        trim: true,
        minlength: [3, 'Too short product title'],
        maxlength: [10, 'Too long product title'],
    },

    color2: {
        type: String,
        required: true,
        trim: true,
        minlength: [3, 'Too short product title'],
        maxlength: [10, 'Too long product title'],
    },
    color3: {
        type: String,
        required: true,
        trim: true,
        minlength: [3, 'Too short product title'],
        maxlength: [10, 'Too long product title'],
    },
    color4: {
        type: String,
        required: true,
        trim: true,
        minlength: [3, 'Too short product title'],
        maxlength: [10, 'Too long product title'],
    },
    slug: {
        type: String,
        lowercase: true,

    },


    category: {
        type: mongoose.Schema.ObjectId,
        ref: 'Category',
        required: [true, 'SubCategory must be belong to parent category'],
    },

},

    {// اعدادات للسكيما
        timestamps: true
    });
module.exports = mongoose.model('Subcategory', subCategorySchema);