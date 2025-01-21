const express = require('express'); 
const { error } = require('console');
const bodyParser = require('body-parser');
const { query ,  pool} = require('../../config/data_base'); 
const {client} = require('pg')
const notification = require('../../Helper/notification')

const OrderMachine = async (req, res) => {
    try {
      const user = req.user;
      const { latitude, longitude, orderList } = req.body;
      while(true) {
        const queryResult = await pool.query('SELECT id, name, latitude, longitude FROM machine WHERE state = $1', ['on']);
        const machines = queryResult.rows;
      
        if (machines.length === 0) {
          return res.status(404).json({ message: 'No machines available' });
        }
      
        const origins = `${latitude},${longitude}`;
        const destinations = machines.map(m => `${m.latitude},${m.longitude}`).join('|');
      
        const apiKey = 'AIzaSyB6Xr0KQ_nJN3JT_SfPB91eo0McmAPSTjY';
        const distanceMatrixUrl = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origins}&destinations=${destinations}&key=${apiKey}`;
        const distanceResponse = await fetch(distanceMatrixUrl);
        const distanceData = await distanceResponse.json();
      
      
        if (distanceData.status !== 'OK') {
          return res.status(500).json({ message: 'Error fetching distances from Google Maps API' });
        }
      
        const distances = distanceData.rows[0].elements;
      
        let nearestMachine = null;
        let minDistance = Infinity;
      
        distances.forEach((distanceInfo, index) => {
          if (distanceInfo.status === 'OK' && distanceInfo.distance.value < minDistance) {
            minDistance = distanceInfo.distance.value;
            nearestMachine = machines[index];
          }
        });
        
        if (!nearestMachine) {
          return res.status(404).json({ message: 'No nearby machine found' });
        }
    
        const directionsUrl = `https://maps.googleapis.com/maps/api/directions/json?origin=${origins}&destination=${nearestMachine.latitude},${nearestMachine.longitude}&key=${apiKey}`;
    
        const directionsResponse = await fetch(directionsUrl);
        const directionsData = await directionsResponse.json();
    
        if (directionsData.status !== 'OK') {
          return res.status(500).json({ message: 'Error fetching route from Google Maps API' });
        }
    
        const route = [];
        const legs = directionsData.routes[0].legs;
    
        legs.forEach(leg => {
          leg.steps.forEach(step => {
            const latLng = step.end_location;
            route.push({ lat: latLng.lat, lng: latLng.lng });
          });
        });
      //   console.log(route);

        const content = "The machine is on its way to you.";
        const content2 = "The machine has arrived.";
        let check = 0 ;
    
        notification.clients.forEach( cl => {
          if(cl.userID == user.id){
            check = 1 
            cl.send(content);
          }
        });

        if(!check) return res.status(404).json({message : "User_ID is not found"})

        const ok = await query(`SELECT * FROM machine WHERE id = ${nearestMachine.id} AND state = 'on'`);
        
        if(ok.length === 0) {
          continue;
        }

        await query(`INSERT INTO notification(user_id, machine_id, content) VALUES(${user.id}, ${nearestMachine.id}, '${content}')`);
        await query(`UPDATE machine SET state = 'inOrder' WHERE id = ${nearestMachine.id}`);   
      
        await query(`insert into orders (user_id ,  machine_id , list ) values ( ${user.id} ,${nearestMachine.id} , '{${orderList}}' )`)

        // Move machine along the route
        let i = route.length - 1;
        const interval = setInterval(async () => {
          if (i < 0) {
            await query(`update orders set confirmed = TRUE where user_id = ${user.id} and machine_id =  ${nearestMachine.id} and list = '{${orderList}}' and confirmed= FALSE `)
            await query(`UPDATE machine SET state = 'on', sorted = false WHERE id = ${nearestMachine.id}`);
            await query(`INSERT INTO notification(user_id, machine_id, content) VALUES(${user.id}, ${nearestMachine.id}, '${content2}')`);
            notification.clients.forEach( cl => {
              if(cl.userID == user.id){
                cl.send(content2);
              }
            });
            clearInterval(interval);

          } else {
              // console.log(route[i]);
            await query(`UPDATE machine SET latitude = ${route[i].lat}, longitude = ${route[i].lng} WHERE id = ${nearestMachine.id}`);
            i--;
          }
        }, 1000);

        return res.status(200).json({
          nearestMachine,
          distance: minDistance
        });
      }
    } catch (error) {
      console.error('Error in OrderMachine:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };
  
  module.exports = OrderMachine;
  