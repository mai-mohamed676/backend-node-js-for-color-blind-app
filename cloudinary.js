// eslint-disable-next-line import/no-extraneous-dependencies
const cloudinary = require('cloudinary').v2;
//const cloudinaryUpload = require('../services/myClothService');

// Configure Cloudinary with your account credentials
cloudinary.config({
    cloud_name: 'dj2feqdce',
    api_key: '944597533285348',
    api_secret: 'DA0PlLdu2IN5BXJJ3pWUWWkI_O8'
});

module.exports = cloudinary;