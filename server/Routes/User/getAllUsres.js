const express = require('express');
const router = express.Router();

const GetAllUsers = require('../../Controllers/User/getAllUsers.js')
const VerifyJWT = require('../../middleware/verifyJWT.js')
const CheckAdminRole = require('../../middleware/AdminRole.js');

router.get('/' , VerifyJWT ,CheckAdminRole , GetAllUsers) ;

module.exports = router ; 