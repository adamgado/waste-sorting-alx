const express = require('express');
const router = express.Router();

const SignUp = require('../../Controllers/User/SignUp')

router.post("/", SignUp);

module.exports = router ;