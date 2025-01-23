const express = require('express');
const router = express.Router();

const GetAllMaterial = require('../../Controllers/Material/getAllMaterial.js')
const VerifyJWT = require('../../middleware/verifyJWT.js')
const CheckAdminRole = require('../../middleware/AdminRole.js');

router.get('/', GetAllMaterial);

module.exports = router ; 