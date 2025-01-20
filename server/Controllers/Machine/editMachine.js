const express = require('express'); 
const { error } = require('console');
const bodyParser = require('body-parser');
const { query ,  pool} = require('../../config/data_base'); 

const editMachine = async(req , res)=>{

    const { id , name , latitude , longitude , state } = req.body;
    const machine = (await query(`select * from machine where id = ${id}`))[0];
    if(!machine) return res.status(404).json({message : "machine with this id not found !"})

    if(!!latitude ^ !!longitude){
        if(!latitude) latitude = machine.latitude ;
        else longitude = machine.longitude ;
    }

    const found  = (await query(`select * from machine 
        where 
        (name = '${name}' or (latitude = ${latitude} and longitude = ${longitude})) and id != ${id}`))[0]
        
    if(found) {
      if(found.name == name )  return res.status(401).json({message : "cannot update the name!"});
      if(found.latitude == latitude && found.longitude == longitude )  return res.status(401).json({message : "cannot update the location!"});
    }

    if(!name ) name = machine.name ;
    if(!state) state = machine.state ;

    try{
        await query(`update machine set 
            name = '${name}' , longitude = '${longitude}' , latitude = '${latitude}' , state = '${state}'
            where id = ${id}`);

        return res.status(200).json({message : "updated successfully"});
    }
    catch(err){
        return res.status(500).json({message : err });
    }
}

module.exports = editMachine ; 