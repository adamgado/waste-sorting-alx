const express = require('express');
const router = express.Router();

const EditProfile = require('../../Controllers/User/editUserRole.js')
const VerifyJWT = require('../../middleware/verifyJWT.js')
const AdminRole = require('../../middleware/AdminRole.js')

router.patch('/', VerifyJWT, AdminRole, EditProfile);

module.exports = router ; 