const express = require('express');
const { error, log } = require('console');
const bodyParser = require('body-parser');
const { query, pool } = require('../../config/data_base');

const DeleteMachine = async (req, res) => {
    const MachineId = req.body.id;

    try {
        const found = await query(`SELECT * FROM machine WHERE id = ${MachineId}`);
        if (!found[0]) return res.status(404).json({ message: "Machine with this ID not found" });
    } catch (err) {
        log(err); // Log the error for debugging
        return res.status(500).json({ message: "Internal server error" });
    }

    try {
        await query(`DELETE FROM machine WHERE id = ${MachineId}`);
        return res.status(200).json({ message: "Deleted successfully" });
    } catch (err) {
        log(err); // Log the error for debugging
        return res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = DeleteMachine;
