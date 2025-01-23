const express = require('express'); 
const { error, log } = require('console');
const bodyParser = require('body-parser');
const { query ,  pool} = require('../../config/data_base');
const notification = require('../../Helper/notification')

const GetReport = async(req , res )=>{
try {
    const user = req.user;
    const MachineId =  req.body.id
    
    const last_report = await query(`select * from last_report where machine_id = ${MachineId}`);
    
    const getMachine = async(id)=>{
        const machineQuery = await query(`SELECT * FROM machine WHERE id = ${id}`)
    
        if(machineQuery.length === 0) {
            return null
        }
        return machineQuery[0];
    }
    const machine = await getMachine(MachineId);

    if(!machine)
        return res.status(404).json({message: "machine not found."});

    if(last_report.length > 0) {
        await query(`INSERT INTO notification(user_id, machine_id, content)
            VALUES(${user.id}, ${MachineId}, '${last_report[0].content}')`)
        notification.clients.forEach(async(cl) => {
            if(cl.userID == user.id){
                cl.send(last_report[0].content);
            }
        });
        return res.status(200).json({message: "done"})
    }

    const Data = await query(`select
        orders.id AS id , orders.list AS materials , orders.confirmed AS status,machine.name AS machineName
        from machine join orders 
        on machine.id = orders.machine_id
        where machine.id = ${MachineId} and orders.maintained = false`);
    const materials = await query(`SELECT 
        materials.id AS id , materials.name as name, category.name as categoryname, category.recyclable as recyclable
        FROM materials JOIN category ON  
        materials.cat_id = category.id`);
        
    let recyclable = {}
    let Notrecyclable = {}
    Data.forEach((order) => {
        const list = [...order.materials]
        order.materials = []
        materials.forEach((material) => {
            const quantity = list.filter(num => num === material.id).length;
            if(quantity > 0) {
                if(material.recyclable){
                    recyclable[material.name] = (recyclable[material.name] ? recyclable[material.name] :  0) + quantity;
                }
                else{
                    Notrecyclable[material.name] = (Notrecyclable[material.name] ?Notrecyclable[material.name] : 0) + quantity;
                }
            }
        })
    });

    let check = false
    await query(`INSERT INTO notification(user_id, machine_id, content)
        VALUES(${user.id}, ${MachineId}, 'Your report is being prepared.')`)
    notification.clients.forEach( async(cl) => {
      if(cl.userID == user.id){
        check = true
        cl.send(`Your report is being prepared.`);
      }
    });
    if(!check) {
        return res.status(404).json({message: "User not found."});
    }
    setTimeout(async() => {
        
        const machine1 = await getMachine(MachineId);

        let content = ``;
        if(!machine1) {
            content = `Machine ${machine.name} has been deleted`;
        }
        else if(Data.length === 0) {
            content = `Machine ${machine1.name} have no material.`
        }
        else if(machine1.sorted) {
            content = `machine is sorted and has\nrecyclable:`
            Object.entries(recyclable).forEach(async([key, value]) => {
                content += `\n\t${key}: ${value}`;
            });
            if(Object.keys(recyclable).length === 0) {
                content += `\n\tNo recyclable.`;
            }
            content += `\nnon recyclable:`
            Object.entries(Notrecyclable).forEach(async([key, value]) => {
                content += `\n\t${key}: ${value}`;
            });
            if(Object.keys(Notrecyclable).length === 0) {
                content += `\n\tNo Non recyclable.`;
            }
        }
        else {
            const all = {...Notrecyclable, ...recyclable};
            content = `machine is not sorted yet and has`
            Object.entries(all).forEach(async([key, value]) => {
                content += `\n\t${key}: ${value}`;
            });
            if(Object.keys(all).length === 0) {
                content += `\n\tNo material.`;
            }
        }

        
        await query(`INSERT INTO last_report(machine_id, content)
            VALUES(${MachineId}, '${content}')`);
        await query(`INSERT INTO notification(user_id, machine_id, content)
            VALUES(${user.id}, ${MachineId}, '${content}')`)
        notification.clients.forEach(async(cl) => {
            if(cl.userID == user.id) {
                cl.send(content);
            }
        });
    }, 30000);

    return res.status(200).json({message: "done"})
}
catch(err) {
    return res.status(500).json({message: err})
}
}

module.exports = GetReport
