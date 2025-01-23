const express = require('express');
const router = express.Router();

const GetReport = require('../../Controllers/User/getReport.js')
const VerifyJWT = require('../../middleware/verifyJWT.js')
const CheckAdminRole = require('../../middleware/AdminRole.js');

router.post('/' , VerifyJWT ,CheckAdminRole , GetReport) ;

module.exports = router ; 