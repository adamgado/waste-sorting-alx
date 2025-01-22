const express = require('express');
const router = express.Router();

const SignIn = require('../../Controllers/User/SignIn')

router.post( "/" , SignIn);

module.exports = router ;