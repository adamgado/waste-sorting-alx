const express = require('express');
const {body , validationResult } = require('express-validator');

const PassValidator = async(req , res)=>{
    const errors = validationResult(req);
    if(errors){
        return res.send(400).josn({errors});
    }
    
} 
module.exports = PassValidator ;