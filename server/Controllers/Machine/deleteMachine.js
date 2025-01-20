const express = require('express'); 
const { error } = require('console');
const bodyParser = require('body-parser');
const { query ,  pool} = require('../../config/data_base'); 

const DeleteMachine = async(req , res)=>{

    const MachineId = req.body.id ;
    
    try{
        const found  = await query(`select * from machine where id = ${MachineId}`);
        if(!found[0]) return res.status(401).json({message : "machine with this id not found"});
    }
    catch(err){
        return res.status(500).json({message : err});
    }

    try{
        await query (`DELETE FROM machine WHERE id = ${MachineId}`)
        return res.status(200).json({message : "Deleted successfully" });

    }
    catch(err){
        return res.send(500).json({message : err});
    }
}
module.exports = DeleteMachine ; 