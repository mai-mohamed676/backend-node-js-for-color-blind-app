const express = require('express');
const upload = require("../middlewares/multer");

const {
    createMyCloth,
    getMyCloth,
    getMyClothes,
    deleteMyCloth,
    setUserIdtoBody,
    createFilterObj,
    getMyClothoutfit
} = require('../services/myClothService');


const {
    createMyClothValidator,
    getMyClothValidator,
    deleteMyClothValidator
} = require('../utils/vaildators/myClothVaildator');


//mergeparams allow us to access parameters on the other routers
const router = express.Router({ mergeParams: true });
router.route('/getmyoutfit/:id').get(getMyClothValidator,getMyClothoutfit);

router.route('/:userId')
    .get(createFilterObj, getMyClothes);

// Route to add a new cloth for a specific user
router.route('/addclothes/:userId')
    .post(upload.single('image'), setUserIdtoBody, createMyClothValidator, createMyCloth);



router.route('/:id')
    .get(getMyClothValidator, getMyCloth)

    .delete(deleteMyClothValidator, deleteMyCloth);



module.exports = router; 