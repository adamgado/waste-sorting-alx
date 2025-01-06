const express = require('express');
const path = require('path');
const {query, pool} = require('./config/data_base');
const jwt = require('jsonwebtoken');
const WebSocket = require('ws');
const cors = require('cors');
const { TIMEOUT } = require('dns');
// const multer = require('multer')

const app = express();
const port = 3000;
const host = 'localhost';
const machine = new WebSocket.Server({ port: 8080 }); // add, remove, moved on map(edit)
 

app.use(cors());
app.use(express.json());

app.use('/signin', require('./Routers/User/signIn'));
app.use('/signup', require('./Routers/User/signup'));
app.use('/user', require('./Routers/User/getUser'));
app.use('/getAllUsres', require('./Routers/User/getAllUsres'));
app.use('/editeRoleUser', require('./Routers/User/editeRoleUser'));
app.use('/editProfile', require('./Routers/User/editProfile'));
app.use('/addmachine', require('./Routers/Machine/addMachine'));
app.use('/deletemachine', require('./Routers/Machine/deletMachine'));
app.use('/editmachine', require('./Routers/Machine/editMachine'));
app.use('/getmaterial', require('./Routers/Material/getAllMatrials'));
app.use('/getcategories', require('./Routers/Material/getAllCategories'));
app.use('/machine', require('./Routers/Machine/getMachine'));
app.use('/getAllMachines', require('./Routers/Machine/getAllMachines'));
app.use('/ordermachine' , require('./Routers/User/orderMachine'));
app.use('/notifications' , require('./Routers/User/getNotifications'));
app.use('/deletNotification' , require('./Routers/User/deletNotifications'));
app.use('/report' , require('./Routers/User/Report'));
app.use('/sortMachine' , require('./Routers/Machine/sortMachine'));

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, '../view/public/images/profiles');
//     },
//     filename: (req, file, cb) => {
//         cb(null, `${file.originalname}`);
//     },
// });
  
// const upload = multer({ storage });

// app.post('/upload', upload.single('image'), (req, res) => {
//     if (!req.file) {
//         return res.status(400).send('No file uploaded.');
//     }
//     res.send({ message: 'File uploaded successfully', file: req.file });
// });

(async()=>{ 
    const pgClient = await pool.connect(); 
    await pgClient.query(`listen machine_add `)
    pgClient.on('notification', (msg) => {
        let data  = JSON.parse(msg.payload);
        data.type = "insert"
        machine.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data));
        }
        });
    });
})();

(async()=>{
    const pgClient = await pool.connect(); 
    await pgClient.query(`listen machine_update `)
    pgClient.on('notification', async(msg) => {
        let data  = JSON.parse(msg.payload);
        await query(`DELETE FROM last_report WHERE machine_id = ${data.id}`);
        data.type = "update"
        machine.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data));
        }
        });
    });
})();

(async()=>{ 
    const pgClient = await pool.connect(); 
    await pgClient.query(`listen machine_delete `)
    pgClient.on('notification', (msg) => {
        let data  = JSON.parse(msg.payload);
        data.type = "delete"
        machine.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data));
        }
        });
    });
})();

(async()=>{
    setInterval(async () => {
        try {
            const randomMachines = await query(`SELECT id FROM machine WHERE state = 'on' ORDER BY RANDOM() LIMIT 5`);
    
            const machineIds = randomMachines.map(machine => machine.id);
            if (machineIds.length === 0) return;
    
            await query(`UPDATE machine SET state = 'maintenance' WHERE id IN (${machineIds.join(',')})`);
    
            setTimeout(async () => {
                await query(`UPDATE machine SET state = 'on' WHERE id IN (${machineIds.join(',')})`);
                await query(`UPDATE orders SET maintained = true WHERE machine_id IN (${machineIds.join(',')})`);
                await query(`DELETE FROM last_report WHERE machine_id IN (${machineIds.join(',')})`);
            }, 0.25 * 60000);
        } catch (error) {
            console.error('Error updating machine states:', error);
        }
    }, 5 * 60000);
})()


app.listen(port, host, async(err) => {
    if(err) {
        console.error('Server error:', err);
        process.exit(-1);
    }
    console.log(`App running at http://${host}:${port}`);
});