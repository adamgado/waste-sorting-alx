const express = require('express'); 
const { error } = require('console');
const bodyParser = require('body-parser');
const { query ,  pool} = require('../../config/data_base'); 

const GetAllUsers = async(req , res )=>{

    const Users = await query(`select id , name , email , role , gender , urlphoto from users `);

    if(!Users) return res.status(404).json({message: "There are no users yet!"});

    return res.status(200).json({Users});

}

module.exports  = GetAllUsers   ;
