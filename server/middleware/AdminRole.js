const express = require('express');
const { query ,  pool} = require('../config/data_base'); 

const CheckRole  = async(req , res , next )=>{
    const User = req.user ;
    if(User.role  != 'Admin') return res.status(400).json({message : "Have no privilges"});
    next();   
}

module.exports = CheckRole ; 