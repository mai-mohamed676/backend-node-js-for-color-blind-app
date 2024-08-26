const mongoose = require('mongoose');

const myClothSchema = new mongoose.Schema({
    url: {
        type: String,
        required: true,
        trim: true,
        unique: false
    },
    listType: {
        type: String,
        required: true,
        trim: true,
        unique: false
    },
    outputData: {
        type: [String], // "Output Data" is an array of strings
        required: true,
        trim: true,
        unique: false
    },
    photoPath: {
        type: String,
        required: true,
        trim: true,
        unique: false
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'the outfit must belong to a user'],
    },
}, {
    timestamps: true
});

module.exports = mongoose.model('myCloth', myClothSchema);