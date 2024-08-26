const slugify = require('slugify')
const asyncHandler = require('express-async-handler');
// eslint-disable-next-line no-unused-vars
const ApiError = require('../utils/apiError');
const SubCategory = require('../models/subCategoryModel');
const factory = require('./handlersFactory');


//nested route
//Get /api/vi/categories/:categoryId/subcategories
exports.createFilterObj = (req, res, next) => {
    let filterObject = {};
    if (req.params.categoryId) filterObject = { category: req.params.categoryId };
    req.filterObj = filterObject;
    next();
};
exports.setCategoryIdToBody = (req, res, next) => {
    //nested route
    if (!req.body.category) req.body.category = req.params.categoryId;
    next();
};
//@desc    Create subcategory
//@route   Post  /api/v1/subcategories
//@access  Private
exports.createSubCategory = asyncHandler(async (req, res) => {

    req.body.slug = slugify(req.body.name);
    const subCategory = await SubCategory.create(req.body);
    res.status(200).json({ data: subCategory });

});
//@desc    get list of subcategory
//@route   GET  /api/v1/subcategories
//@access  Public

exports.getSubCategories = asyncHandler(async (req, res) => {
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 5;
    const skip = (page - 1) * limit;


    const subCategories = await SubCategory.find(req.filterObj)
        .skip(skip)
        .limit(limit)
        .populate({ path: 'category', select: 'name-_id' });
    res.status(200).json({ results: subCategories.length, page, data: subCategories });
});
//@desc    Get specfifc subcategory by id
//@route   GET  /api/v1/subcategories/:id
//@access  Public
exports.getSubCategory = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const subCategory = await SubCategory.findById(id)
        .populate({ path: 'category', select: 'name-_id' });
    if (!subCategory) {

        return next(new ApiError(`No subcategory for this id ${id}`, 404));
    }
    res.status(200).json({ data: subCategory });

});
//@desc    Update specfifc subcategory by id
//@route   PUT  /api/v1/categories/:id
//@access  Private 
exports.updateSubCategory = factory.updateOne(SubCategory);


//@desc    delete subcategory
//@route   DELETE  /api/v1/categories
//@access  Private

exports.deleteSubCategory = factory.deleteOne(SubCategory);
