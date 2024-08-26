/* eslint-disable new-cap */
const mongoose = require('mongoose');


//1-Create Schema
const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name required.'],
        unique: [true, 'Name already used.'],
        minlength: [3, 'Name too short .'],
        maxlength: [30, 'Name too long.'],
    },
    slug: {
        type: String,
        lowercase: true,
    },
    image: String,


},
    { timestamps: true }
);

//2- Create Model which convert Schema
const Category = new mongoose.model('Category', categorySchema);

module.exports = Category;  