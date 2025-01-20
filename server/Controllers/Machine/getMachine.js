const express = require('express'); 
const { error } = require('console');
const bodyParser = require('body-parser');
const { query ,  pool} = require('../../config/data_base'); 



const GetMachine = async(req , res)=>{
    const machineId = req.query.id; 
    try{
        const Machine = await query(`select * from machine where id = ${machineId}`);

        if(!Machine[0]) return res.status(404).json({message : `Machine with this id not found `});
        return res.status(200).json({message : "successful", machine: Machine[0]});
    }
    catch(err){
        return res.status(500).json({message : err});
    }

}

module.exports = GetMachine ; 