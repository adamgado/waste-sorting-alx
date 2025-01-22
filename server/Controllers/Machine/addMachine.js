const express = require('express');
const { error, log } = require('console');
const bodyParser = require('body-parser');
const { query, pool } = require('../../config/data_base');

const AddMachine = async (req, res) => {
    const { name, latitude, longitude, state } = req.body;

    if (!name) return res.status(400).json({ message: "Name is required" });
    if (!latitude || !longitude) return res.status(400).json({ message: "Location is required" });

    try {
        const checkName = (await query(`SELECT * FROM machine WHERE name = '${name}'`))[0];
        if (checkName) return res.status(400).json({ message: "Machine with this name already exists!" });

        try {
            const checkLocation = await query(`SELECT * FROM machine WHERE latitude = ${latitude} AND longitude = ${longitude}`);
            if (checkLocation[0]) return res.status(400).json({ message: "Location is busy right now" });

            const insertQuery = state == null
                ? `INSERT INTO machine (name, latitude, longitude, estimatedTime) VALUES ('${name}', ${latitude}, ${longitude}, '00:30:00')`
                : `INSERT INTO machine (name, latitude, longitude, state, estimatedTime) VALUES ('${name}', ${latitude}, ${longitude}, '${state}', '00:30:00')`;

            await query(insertQuery);
            return res.status(200).json({ message: "Added successfully" });
        } catch (err) {
            log(err); // Log the error for debugging
            return res.status(500).json({ message: "Internal server error" });
        }
    } catch (err) {
        log(err); // Log the error for debugging
        return res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = AddMachine;
