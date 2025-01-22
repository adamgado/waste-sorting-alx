const express = require('express');
const { error, log } = require('console');
const bodyParser = require('body-parser');
const { query, pool } = require('../../config/data_base');

const GetAllMachines = async (req, res) => {
    try {
        const Machines = await query(`SELECT * FROM machine`);
        return res.status(200).json({ message: "Done", result: Machines });
    } catch (err) {
        log(err); //error checking
        return res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = GetAllMachines;
