const express = require('express');
const router = express.Router();

const CheckAdminRole = require('../../middleware/AdminRole.js');
const verifyJWT = require('../../middleware/verifyJWT.js');
const sortMachine = require('../../Controllers/Machine/sortMachine.js');

router.patch('/', verifyJWT, CheckAdminRole, sortMachine) ;

module.exports = router;