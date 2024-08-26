const slugify = require('slugify');
const asyncHandler = require('express-async-handler');
const axios = require('axios');
//const express = require('express');
const cloudinary = require("../utils/cloudinary");
const MyCloth = require('../models/myClothModel');
const ApiError = require('../utils/apiError');
const upload = require("../middlewares/multer");

// eslint-disable-next-line no-unused-vars
const myClothModel = require('../models/myClothModel');
exports.createFilterObj = (req, res, next) => {
    let filterObject = {};
    if (req.params.userId) filterObject = { user: req.params.userId };
    req.filterObject = filterObject;
    next();
}
exports.setUserIdtoBody = (req, res, next) => {
    if (!req.body.user) req.body.user = req.params.userId;
    next();
};
exports.createMyCloth = async (req, res, next) => {
    try {
        // Extract the user ID from the request parameters or body
        const userId = req.params.userId || req.body.user;
        // Check if the user ID is valid
        if (!userId) {
            throw new ApiError('Invalid user ID', 400);
        }
        // Check if file is uploaded
        if (!req.file) {
            throw new ApiError('No file uploaded', 400);
        }
        // Upload image to Cloudinary
        const cloudinaryResponse = await cloudinary.uploader.upload(req.file.path);
        console.log('Cloudinary Response:', cloudinaryResponse); // Log the Cloudinary response

        // Make POST request to API with Cloudinary URL
        const apiResponse = await axios.post('http://127.0.0.1:5000/add_photo', { "url": cloudinaryResponse.url });
        // Extract data from API response
        const { "List Type": listType, "Output Data": outputData, "Photo Path": photoPath, message, success } = apiResponse.data;

        // Check if the response was successful
        if (!success) {
            throw new ApiError(message || 'Error in processing photo', 500);
        }

        // Combine data
        const newData = {
            listType, // Assign the extracted listType
            outputData, // Assign the extracted outputData
            photoPath, // Assign the extracted photoPath
            user: userId,
            url: cloudinaryResponse.url
        };
        // Save to database
        const newDoc = await MyCloth.create(newData);
        // Respond with the newly created document
        res.status(201).json({ data: newDoc });
    } catch (error) {
        // Log detailed error message
        console.error('Error in createMyCloth:', error);
        // Pass the error to the error handling middleware
        next(error);
    }
};
// get/api/user/:userId/myClothes
exports.getMyClothes = asyncHandler(async (req, res) => {
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 5;
    const skip = (page - 1) * limit;

    const myCloth = await MyCloth.find(req.filterObj)
        .skip(skip)
        .limit(limit)
        .populate({ path: 'user', select: 'name-_id' });
    res.status(200).json({ results: myCloth.length, page, data: myCloth });
});
//@desc    Get specfifc myCloth by id
//@route   GET  /api/v1/favorites/:id
//@access  Public
exports.getMyCloth = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const myCloth = await MyCloth.findById(id);
    if (!myCloth) {

        return next(new ApiError(`No outfit for this id ${id}`, 404));
    }
    res.status(200).json({ data: myCloth });
});


//@desc    delete favorite
//@route   DELETE  /api/v1/favorites 
//@access  Private
exports.deleteMyCloth = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const document = await MyCloth.findByIdAndDelete(id);

    if (!document) {
        return next(new ApiError(`No document for this id ${id}`, 404));
    }

    res.status(200).json({
        status: 'success',
        message: 'document has been deleted successfully.',
    });
});
const sendDataToLinkAPI = async (data) => {
    try {
        // Make a POST request to the Link API machine with the data
        const response = await axios.post('https://link-api-machine.com/send-data', data);
        // Return the response data
        return response.data;
    } catch (error) {
        // Handle any errors
        console.error('Error sending data to Link API machine:', error);
        throw new Error('Failed to send data to Link API machine');
    }
};
// Function to receive data from the Link API machine
const receiveDataFromLinkAPI = async (myCloth ) => {
    try {
        // Send data to Link API machine and receive the response
        const response = await sendDataToLinkAPI(myCloth );
        // Return the received response
        return response;
    } catch (error) {
        // Handle any errors
        console.error('Error receiving data from Link API machine:', error);
        throw new Error('Failed to receive data from Link API machine');
    }
};
//@desc    get mycloth outfit
//@route   GET  /api/v1/mycloth/:type
//@access  Public
exports.getMyClothoutfit = asyncHandler(async (req, res,next) => {
   const myCloth = await MyCloth.find(req.filterObj)
    try {
        // Send outfit data to the Link API machine and receive a response
        const receivedData = await receiveDataFromLinkAPI(myCloth );
        // Send the received data to the client
        res.status(200).json(receivedData);
    } catch (error) {
        // Handle any errors
        return next(new ApiError('Error receiving data from Link API machine', 500));
    }
});

 




/*
const sendDataToLinkAPI = async (data) => {
    try {
        // Make a POST request to the Link API machine with the data
        const response = await axios.post('https://link-api-machine.com/send-data', data);

        // Return the response data
        return response.data;
    } catch (error) {
        // Handle any errors
        console.error('Error sending data to Link API machine:', error);
        throw new Error('Failed to send data to Link API machine');
    }
};
const bottom = [{
    name: "",
    type: "",
    description: "",
    url: ""
}];
const top = [{
    name: "",
    type: "",
    description: "",
    url: ""
}];
const shoes = [{
    name: "",
    type: "",
    description: "",
    url: ""
}];
//@desc    get mycloth outfit
//@route   GET  /api/v1/mycloth/:type
//@access  Public
exports.getMyClothoutfit = asyncHandler(async (req, res) => {
    const { name, type, url, description } = req.body;
    const foundbottom = bottom.find(item =>
        item.name === name &&
        item.type === type &&
        item.description === description &&
        item.url === url
    );
    if (!foundbottom) {

        // eslint-disable-next-line no-undef
        return next(new ApiError(`No outfit for this item ${bottom}`, 404));
    }
    const foundtop = top.find(item =>
        item.name === name &&
        item.type === type &&
        item.description === description &&
        item.url === url
    );
    if (!foundtop) {

        // eslint-disable-next-line no-undef
        return next(new ApiError(`No outfit for this item ${top}`, 404));
    }
    const foundshoes = shoes.find(item =>
        item.name === name &&
        item.type === type &&
        item.description === description &&
        item.url === url
    );
    if (!foundshoes) {

        // eslint-disable-next-line no-undef
        return next(new ApiError(`No outfit for this item ${shoes}`, 404));
    }
    const shoesWithUrls = shoes.map(shoe => ({
        ...shoe, url:
            `${shoe.url}?bottom=${foundbottom.url}&top=${foundtop.url}&shoes=${shoe.url}`
    }));
    const dataToSend = {
        bottom: foundbottom,
        top: foundtop,
        shoes: shoesWithUrls
    };

    try {
        // Send data to Link API machine
        const linkApiResponse = await sendDataToLinkAPI(dataToSend);

        // Send the response from Link API machine to the client
        res.status(200).json(linkApiResponse);
    } catch (error) {
        // Handle any errors
        // eslint-disable-next-line no-undef
        return next(new ApiError('Error sending data to Link API machine', 500));
    }
    res.status(200).json({ bottom: foundbottom, top: foundtop, shoes: foundshoes });

});
*/





/*exports.createMyCloth = asyncHandler(async (req, res, next) => {
    try {
        if (!req.body.name) {
            return next(new ApiError('Name is required for cloth creation', 400));
        }

        // Generate slug using name field
        //req.body.slug = slugify(req.body.name, { lower: true });


        const myCloth = await MyCloth.create(req.body);

        res.status(200).json({ data: myCloth });
    } catch (error) {
        next(error); // Forward error to the error handling middleware
    }
});*/
