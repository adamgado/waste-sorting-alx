const express = require('express');
const { error, log } = require('console');
const bodyParser = require('body-parser');
const { query, pool } = require('../../config/data_base');

const editMachine = async (req, res) => {
    let { id, name, latitude, longitude, state } = req.body;

    try {
        const machine = (await query(`SELECT * FROM machine WHERE id = ${id}`))[0];
        if (!machine) return res.status(404).json({ message: "Machine with this ID not found!" });

        if (!!latitude ^ !!longitude) {
            if (!latitude) latitude = machine.latitude;
            else longitude = machine.longitude;
        }

        const found = (await query(`SELECT * FROM machine 
            WHERE 
            (name = '${name}' OR (latitude = ${latitude} AND longitude = ${longitude})) AND id != ${id}`))[0];

        if (found) {
            if (found.name === name) return res.status(400).json({ message: "Cannot update the name!" });
            if (found.latitude === latitude && found.longitude === longitude) return res.status(400).json({ message: "Cannot update the location!" });
        }

        if (!name) name = machine.name;
        if (!state) state = machine.state;

        await query(`UPDATE machine SET 
            name = '${name}', longitude = ${longitude}, latitude = ${latitude}, state = '${state}'
            WHERE id = ${id}`);

        return res.status(200).json({ message: "Updated successfully" });
    } catch (err) {
        log(err); // Log the error for debugging
        return res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = editMachine;
