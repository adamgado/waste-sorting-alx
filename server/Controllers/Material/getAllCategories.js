const express = require('express');
const { error, log } = require('console');
const bodyParser = require('body-parser');
const { query, pool } = require('../../config/data_base');

const GetAllCategories = async (req, res) => {
    try {
        const categories = await query(`SELECT id, name FROM category`);
        
        // Uncomment and use this if you want to handle the case where no categories are found
        // if (!categories.length) return res.status(404).json({ message: "No category has been found!" });

        return res.status(200).json({ message: "done", result: categories });
    } catch (err) {
        log(err); // for debugging
        return res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = GetAllCategories;
