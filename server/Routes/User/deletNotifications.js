const express = require('express');
const router = express.Router();

const deletNotification = require('../../Controllers/User/deletNotification.js')
const VerifyJWT = require('../../middleware/verifyJWT.js');

router.delete('/' , VerifyJWT , deletNotification )

module.exports = router 