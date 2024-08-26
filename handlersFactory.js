const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/apiError');
const ApiFeatures = require('../utils/apiFeatures');

exports.deleteOne = (Model) =>
    asyncHandler(async (req, res, next) => {
        const { id } = req.params;
        const document = await Model.findByIdAndDelete(id);

        if (!document) {
            return next(new ApiError(`No document for this id ${id}`, 404));
        }

        res.status(200).json({
            status: 'success',
            message: 'document has been deleted successfully.',
        });
    });

exports.updateOne = (Model) =>
    asyncHandler(async (req, res, next) => {
        const document = await Model.findByIdAndUpdate(req.params.id, req.body, {
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

exports.createOne = (Model) =>
    asyncHandler(async (req, res) => {
        // Extract the user ID from the request body or other appropriate location
        const userId = req.body.user;

        // Create a new object with the user ID and other properties from the request body
        const newData = { ...req.body, user: userId };

        // Create the document using the updated data
        const newDoc = await Model.create(newData);

        // Respond with the newly created document
        res.status(201).json({ data: newDoc });
    });
exports.getOne = (Model, populationOpt) =>
    asyncHandler(async (req, res, next) => {
        const { id } = req.params;
        // 1) Build query
        let query = Model.findById(id);
        if (populationOpt) {
            query = query.populate(populationOpt);
        }

        // 2) Execute query
        const document = await query;

        if (!document) {
            return next(new ApiError(`No document for this id ${id}`, 404));
        }
        res.status(200).json({ data: document });
    });

exports.getAll = (Model, modelName = '') =>
    asyncHandler(async (req, res) => {
        let filter = {};
        if (req.filterObj) {
            filter = req.filterObj;
        }
        // Build query
        const documentsCounts = await Model.countDocuments();
        const apiFeatures = new ApiFeatures(Model.find(filter), req.query)
            .paginate(documentsCounts)
            .filter()
            .search(modelName)
            .limitFields()
            .sort();

        // Execute query
        const { mongooseQuery, paginationResult } = apiFeatures;
        const documents = await mongooseQuery;

        res
            .status(200)
            .json({ results: documents.length, paginationResult, data: documents });
    });