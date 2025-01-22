const express = require('express');
const router = express.Router();

const UserControllers = require('../../Controllers/Machine/editMachine')
const VerifyJWT = require('../../middleware/verifyJWT.js')
const CheckAdminRole = require('../../middleware/AdminRole.js');

router.patch('/', VerifyJWT, CheckAdminRole, UserControllers) ;

module.exports = router ; 