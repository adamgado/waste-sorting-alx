const { query ,  pool} = require('../../config/data_base'); 

const sortMachine = async(req , res)=>{
    const machineId = req.body.id; 
    try{
        const Machine = await query(`select * from machine where id = ${machineId}`);

        if(!Machine[0]) return res.status(404).json({message : `Machine with this id not found `});

        await query(`UPDATE machine SET sorted = true WHERE id = ${machineId}`);

        return res.status(200).json({message : "successful"});
    }
    catch(err){
        return res.status(500).json({message : err});
    }

}

module.exports = sortMachine ; 