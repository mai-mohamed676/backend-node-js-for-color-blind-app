/* eslint-disable import/extensions */
/* eslint-disable node/no-missing-require */

const express = require('express');
// eslint-disable-next-line import/no-unresolved


const { getCategoryValidator, createCategoryValidator, updateCategoryValidator, deleteCategoryValidator, } = require("../utils/vaildators/categoryValidetor");

const {
    getCategories,
    getCategory,
    createCategory,
    updateCategory,
    deleteCategory

} = require('../services/categoryService');
// eslint-disable-next-line import/no-unresolved, no-unused-vars
const subcategoriesRoute = require('./subCategoryRout');

const router = express.Router();

router.use('/:categoryId/subcategories', subcategoriesRoute);


router.route("/").get(getCategories).post(createCategoryValidator, createCategory);
router
    .route("/:id")
    .get(getCategoryValidator, getCategory)
    .put(updateCategoryValidator, updateCategory)
    .delete(deleteCategoryValidator, deleteCategory);
module.exports = router; 