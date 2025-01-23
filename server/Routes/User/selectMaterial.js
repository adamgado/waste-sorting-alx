const express = require('express');
const router = express.Router();

const SelectMatrial = require('../../Controllers/User/selectMatrial') ;
const VerifyJWT = require('../../middleware/verifyJWT.js')

router.post('/' , VerifyJWT , SelectMatrial) ;

module.exports = router ;