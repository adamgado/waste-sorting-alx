const express = require('express');
const router = express.Router();

const OrderMachine = require('../../Controllers/User/orderMachine');
const VerifyJWT = require('../../middleware/verifyJWT.js')

router.post('/' ,VerifyJWT , OrderMachine);

module.exports = router ;  