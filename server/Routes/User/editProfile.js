const express = require('express');
const router = express.Router();

const EditProfile = require('../../Controllers/User/editProfile.js')
const VerifyJWT = require('../../middleware/verifyJWT.js')

router.patch('/' , VerifyJWT , EditProfile);

module.exports = router ; 