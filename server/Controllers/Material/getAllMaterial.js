const express = require('express');
const { error, log } = require('console');
const bodyParser = require('body-parser');
const { query, pool } = require('../../config/data_base');

const GetAllMaterial = async (req, res) => {
    try {
        const material = await query(`SELECT 
            materials.id AS id, materials.name AS name, category.name AS categoryname, category.recyclable AS recyclable, materials.url_photo AS url_photo
            FROM materials JOIN category ON  
            materials.cat_id = category.id`);
        
        // Uncomment and use this if you want to handle the case where no materials are found
        // if (!material.length) return res.status(404).json({ message: "No Material has been found!" });

        return res.status(200).json({ message: "done", result: material });
    } catch (err) {
        log(err); // debugging
        return res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = GetAllMaterial;
