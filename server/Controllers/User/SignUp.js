const { query ,  pool} = require('../../config/data_base'); 
const bcrypt = require('bcrypt');
const generatejwt = require('../../middleware/GenerateJWT');


const SignUp = async(req , res)=>{
    // be sure i will find it like this sorting !
    const {name , email , gender , password } = req.body ;
    let role = "";

    if(!name || !name.length) {
        return res.status(401).json({message : "Enter valid name"});
    }
    if(!email || !email.length) {
        return res.status(401).json({message : "Enter valid email"});
    }
    if(!gender || (gender != "f" && gender != "m")) {
        return res.status(401).json({message : "Enter valid gender"});
    }
    if(!password || password.length < 3) {
        return res.status(401).json({message : "password must be greater than 3"});
    }

    try{
        const found = await query (`select * from users where email like '${email}'`);
        if (found.length) return res.status(409).json({message : "Already have an account"});
    }
    catch(err){
        return res.status(500).json({message : err});
    }
    


    const hashedPass = await bcrypt.hash(password, 10);

    try{
        const numberOfUser = await query(`select * from users`);
        if(!numberOfUser || numberOfUser.length == 0) {
            role = 'Admin';
        }
        else {
            role = 'User'; 
        }
    }
    catch(err){
        return res.status(500).json({message : err});
    }

    try {
        await query(`insert into users 
        (name , email , gender , role ,password ) 
        values 
        ('${name}' , '${email}' , '${gender}' , '${role}' , '${hashedPass}')`);
    }
    catch(err){
        return res.status(500).json({message : err});
    }

     try{
        const NewUser = await query(`select * from users where email like '${email}' and name like '${name}'`);
        
        const token = generatejwt({id : NewUser[0].id });
    
        return res.status(200).json({ message: "sign up successfully" , token }) ;
    }
    catch(err){
        return res.status(500).json({message : err});
    }
} 


module.exports = SignUp ; 