const express = require('express');
const router = express.Router();

const GetUser = require('../../Controllers/User/getUser.js')
const verifyJWT = require('../../middleware/verifyJWT.js');

router.get('/', verifyJWT ,GetUser);

module.exports = router;