const express = require('express');
const router = express.Router();

const AddMachine = require('../../Controllers/Machine/addMachine.js')
const VerifyJWT = require('../../middleware/verifyJWT.js')
const CheckAdminRole = require('../../middleware/AdminRole.js');

router.post('/' , VerifyJWT ,  CheckAdminRole  , AddMachine) ;

module.exports = router ; 