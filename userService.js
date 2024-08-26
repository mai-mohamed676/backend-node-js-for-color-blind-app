/* eslint-disable import/no-extraneous-dependencies */
const asyncHandler = require('express-async-handler');
const { v4: uuidv4 } = require('uuid');
const sharp = require('sharp');
const bcrypt = require('bcryptjs');

const factory = require('./handlersFactory');
const ApiError = require("../utils/apiError");
const { uploadSingleImage } = require('../middlewares/uploadImageMiddleware');
const User = require('../models/userModel');

// Upload single image
exports.uploadUserImage = uploadSingleImage('profileImg');
// Image processing
exports.resizeImage = asyncHandler(async (req, res, next) => {
    const filename = `user-${uuidv4()}-${Date.now()}.jpeg`;
    if (req.file) {
        await sharp(req.file.buffer)
            .resize(600, 600)
            .toFormat('jpeg')
            .jpeg({ quality: 95 })
            .toFile(`uploads/users/${filename}`);

        // Save image into our db 
        req.body.profileImg = filename;
    }
    next();
});
// @desc    Get list of users
// @route   GET /api/v1/users
// @access  privte
exports.getUsers = factory.getAll(User);

// @desc    Get specific User by id
// @route   GET /api/v1/User/:id
// @access  Public
exports.getUser = factory.getOne(User);

// @desc    Create User
// @route   POST  /api/v1/User
// @access  Private
exports.createUser = factory.createOne(User);

// @desc    Update specific User
// @route   PUT /api/v1/User/:id
// @access  Private
exports.updateUser = asyncHandler(async (req, res, next) => {
    const document = await User.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        slug: req.body.slug,
        phone: req.body.phone,
        email: req.body.email,
        profileImg: req.body.profileImg,
        role: req.body.role,
    }, {
        new: true,
    });

    if (!document) {
        return next(
            new ApiError(`No document for this id ${req.params.id}`, 404)
        );
    }
    // Trigger "save" event when update document
    document.save();
    res.status(200).json({ data: document });
});


exports.changeUserPassword = asyncHandler(async (req, res, next) => {
    const document = await User.findByIdAndUpdate(
        req.params.id,
        {
            password: await bcrypt.hash(req.body.password, 12),
            passwordChangedAt: Date.now(),
        },
        {
            new: true,
        }
    );

    if (!document) {
        return next(new ApiError(`No document for this id ${req.params.id}`, 404));
    }
    res.status(200).json({ data: document });
});

// @desc    Delete specific User
// @route   DELETE /api/v1/User/:id
// @access  Private
exports.deleteUser = factory.deleteOne(User);