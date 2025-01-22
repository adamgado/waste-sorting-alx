const express = require('express');
const router = express.Router();

const DeleteMachine = require('../../Controllers/Machine/deleteMachine.js')
const VerifyJWT = require('../../middleware/verifyJWT.js')
const CheckAdminRole = require('../../middleware/AdminRole.js');

router.delete('/' , VerifyJWT , CheckAdminRole , DeleteMachine ) ;

module.exports = router ; 