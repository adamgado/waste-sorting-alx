const express = require('express');
const router = express.Router();

const GetAllMachines = require('../../Controllers/Machine/getAllMachines.js');

router.get('/', GetAllMachines);

module.exports = router ;