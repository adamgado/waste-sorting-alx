const express = require('express'); 
const { error } = require('console');
const bodyParser = require('body-parser');
const { query ,  pool} = require('../../config/data_base'); 

const EditRole = async(req , res)=>{

    const { id  , NewRole } = req.body ;
    const User = req.user ; 
    try{
        await query(`UPDATE users SET role = '${NewRole}' WHERE id = ${id}`);
        return res.status(200).json({message : "Updated successfully"});
    }
    catch(err){
        return res.status(500).json({message : err});
    }
} 

module.exports = EditRole ; 
