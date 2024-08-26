/* eslint-disable no-unused-vars */
/* eslint-disable import/no-extraneous-dependencies */
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const asyncHandler = require('express-async-handler');
const ApiError = require("../utils/apiError");
const User = require("../models/userModel");

const createToken = (payload) => 
jwt.sign({ userId: payload }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE_TIME,
});
    
// @desc    Login
// @route   GET /api/vi/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res, next) => {
    // 1) check if password and email in the body (validation)
    // 2) check if user exist & check if password is correct
    const user = await User.findOne({ email: req.body.email });

    if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
        return next(new ApiError('Incorrect email or password', 401));
    }
    // 3) generate token
    const token=createToken(user._id);
    // 4) send response to client side
    res.status(200).json({ data: user ,token });
});
// @desc    signup
// @route   POST /api/vi/auth/signup
// @access  Public
exports.signup=asyncHandler(async(req,res,next)=>{
//create to user
const user=await User.create({
    name:req.body.name,
    email:req.body.email,
    password:req.body.password
});
//generate json web token

const token=createToken(user._id);
res.status(201).json({data:user,token});

});
