
const express = require('express');
const router = express.Router();
const { loginValidator ,signupValidator} = require('../utils/vaildators/authValidetor');
const { login,signup } = require('../services/authService');
router.route('/signup').post(signupValidator,signup);
router.route('/login').post(loginValidator, login);
module.exports = router;