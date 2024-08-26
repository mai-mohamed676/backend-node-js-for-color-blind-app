const express = require('express');
const {
  getUserValidator,
  createUserValidator,
  updateUserValidator,
  deleteUserValidator,
  changeUserPasswordValidator,
} = require('../utils/vaildators/userVaildator');

const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  uploadUserImage,
  resizeImage,
  changeUserPassword,
} = require('../services/userService');

const myClothRoute = require('./myClothRoute');

const router = express.Router();
router.use("/:userId/myclothes", myClothRoute);
router.put('/changePassword/:id', changeUserPasswordValidator, changeUserPassword);

router
  .route('/')
  .get(getUsers)
  .post(uploadUserImage, resizeImage, createUserValidator, createUser); // <-- Ensure createUser is provided as the callback function

router
  .route('/:id')
  .get(getUserValidator, getUser)
  .put(uploadUserImage, resizeImage, updateUserValidator, updateUser)
  .delete(deleteUserValidator, deleteUser);

module.exports = router;