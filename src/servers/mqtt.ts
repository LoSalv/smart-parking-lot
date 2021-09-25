import net = require('net');
import  { Server } from 'aedes';
import plates = require('../plugins/plates');
import db = require('../db/db');

const aedes = Server();
const mqttServer = net.createServer(aedes.handle);

// fired when a message is published
aedes.on('publish', async function (packet, client) {
    if(packet.topic === 'gate') {
        console.log('Request mqtt on /gate');
        const payload = JSON.parse(packet.payload.toString());
        try {
            const plate = await plates.getPlate(payload.plate, '', '');
            if (plate == '') return 
            console.log('plate: ', plate);
            await db.addLog(payload.datetime, plate);
        } catch(err) {
            console.error(err);
        }
    } else if(packet.topic === 'parklot') {
        console.log('Request mqtt on /parklot');
        const payload = JSON.parse(packet.payload.toString());
        try {
            await db.changeParkingStatus(payload.parkNumber, payload.isFree);
        } catch (err) {
            console.error(err);
        }
    }
})

export default mqttServer;
