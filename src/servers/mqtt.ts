import net = require('net');
import  { Server } from 'aedes';
import plates = require('../plugins/plates');
import db = require('../db/db');

const aedes = Server();
const mqttServer = net.createServer(aedes.handle);

// fired when a message is published
aedes.on('publish', async function (packet, client) {
    if(packet.topic === 'gate') {
        const payload = JSON.parse(packet.payload.toString());
        console.log(`### Request mqtt on /gate, ${payload.direction} ###`);
        try {
            const plate = await plates.getPlate(payload.plate, '', '');
            if (plate == '') return 
            console.log('\tplate: ', plate);
            await db.addLog(payload.datetime, plate, payload.direction);
        } catch(err) {
            console.error(err);
        }
    } else if(packet.topic === 'parklot') {
        console.log('### Request mqtt on /parklot ###');
        const payload = JSON.parse(packet.payload.toString());
        try {
            await db.changeParkingStatus(payload.parkNumber, payload.isFree, payload.Date3);
        } catch (err) {
            console.error(err);
        }
    }
})

export default mqttServer;
