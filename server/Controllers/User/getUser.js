const express = require('express'); 
const { error } = require('console');
const bodyParser = require('body-parser');
const { query ,  pool} = require('../../config/data_base'); 


const GetUser = async(req, res)=>{
    // console.log(req.user);
    const user = req.user;
    const DataOwnerId = req.query.id? req.query.id: user.id;
    if(user.id == DataOwnerId || user.role == 'Admin'){

        try{
            const Data = await query(`select
                orders.id AS id , orders.list AS materials , orders.confirmed AS status, machine.name AS machineName
                from users join orders 
                on users.id = orders.user_id join machine on machine.id = orders.machine_id
                where users.id = ${DataOwnerId}`);
            const materials = await query(`SELECT 
                materials.id AS id , materials.name as name, category.name as categoryname, category.recyclable as recyclable, materials.url_photo url_photo
                FROM materials JOIN category ON  
                materials.cat_id = category.id`);
 
            Data.forEach((order) => {
                const list = [...order.materials]
                order.materials = []
                materials.forEach((material) => {
                    const quantity = list.filter(num => num === material.id).length;
                    if(quantity > 0) {
                        order.materials.push({...material, quantity});
                    }
                })
            });

            const new_user = await query(`select * from users where id = ${DataOwnerId}`);
            return res.status(200).json({message: "done", user: {...new_user[0], odrers: Data}});
        }
        catch(err){
            return res.status(500).json({message: err });
        }
    }
    else {
        return res.status(401).json({message : "Have no privileges!"})
    }
}

module.exports  = GetUser ;    