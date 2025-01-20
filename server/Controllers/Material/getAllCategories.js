const express = require('express'); 
const { error } = require('console');
const bodyParser = require('body-parser');
const { query ,  pool} = require('../../config/data_base'); 

const GetAllCategories = async(req , res)=>{
    try{
        const categories = await query(`select id , name from category`) ;
        // if(!categories) return res.status(404).json({message: "No category has been found!"})
        
        return res.status(200).json({message:"done" , result : categories});
    }
    catch(err){
        return res.status(500).json({message: err})
    }
}

module.exports = GetAllCategories ;