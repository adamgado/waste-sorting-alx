const express = require('express'); 
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const { query ,  pool} = require('../../config/data_base'); 
const generatejwt = require('../../middleware/GenerateJWT');

const SignIn = async(req , res )=>{
    const {email, password} = req.body ;
    
    if(!email) return res.status(401).json({message : "email is required "})
    if(!password) return res.status(401).json({message : "password is required "})
    
   try{ 
        const user = (await query(`select * from users where email like '${email}'`))[0];
     
        if(!user) return res.status(404).json({message : "invalid email or password "});
        
        const matchPass = await bcrypt.compare(password, user.password);
        if(!matchPass) return res.status(404).json({message : "invalid email or password "})
    
        const token = generatejwt({id: user.id});
    
        return res.status(200).json({message:"Singin successfully" , token}) ;
    }
    catch(err){
        return res.status(500).json({message : err});
    }

}

module.exports = SignIn ; 