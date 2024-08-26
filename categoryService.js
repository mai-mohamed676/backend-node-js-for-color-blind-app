const slugify = require('slugify')
const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/apiError');
const Category = require('../models/categoryModel');
const factory = require('./handlersFactory');



//@desc    get list of category
//@route   GET  /api/v1/categories
//@access  Public

exports.getCategories = asyncHandler(async (req, res) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 1;
  const skip = (page - 1) * limit;

  const categories = await Category.find({}).skip(skip).limit(limit);
  res.status(200).json({ results: categories.length, page, data: categories });
});

//@desc    Get specfifc category by id
//@route   GET  /api/v1/categories/:id
//@access  Public
exports.getCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const category = await Category.findById(id);
  if (!category) {

    return next(new ApiError(`No category for this id ${id}`, 404));
  }
  res.status(200).json({ data: category });

});

//@desc    Update specfifc category by id
//@route   PUT  /api/v1/categories/:id
//@access  Private 
exports.updateCategory = factory.updateOne(Category);


//@desc    delete category
//@route   DELETE  /api/v1/categories
//@access  Private
exports.deleteCategory = factory.deleteOne(Category);

//@desc    Create category
//@route   Post  /api/v1/categories
//@access  Private

exports.createCategory = asyncHandler(async (req, res) => {

  const { name } = req.body;
  const category = await Category.create({ name, slug: slugify(name) });
  res.status(201).json({ data: category });

});
