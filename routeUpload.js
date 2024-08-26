const slugify = require('slugify');
const asyncHandler = require('express-async-handler');
const axios = require('axios');
const express = require('express');
const cloudinary = require("../utils/cloudinary");

const MyCloth = require('../models/myClothModel');
const ApiError = require('../utils/apiError');
const upload = require("../middlewares/multer");






const router = express.Router();

router.post('/upload', upload.single('image'), (req, res) => {
    // Check if file is uploaded
    if (!req.file) {
        return res.status(400).json({
            success: false,
            message: "No file uploaded"
        });
    }

    cloudinary.uploader.upload(req.file.path, (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                success: false,
                message: "Error"
            });
        }

        res.status(200).json({
            success: true,
            message: "Uploaded!",
            data: result
        });
    });
});

module.exports = router;

