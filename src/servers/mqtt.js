const got = require('got');
const aedes = require('aedes')()
const mqttServer = require('net').createServer(aedes.handle)
const mqttPort = 1883

// Main server
const SERVER_PORT = 8124
const SERVER_URL = `localhost:${SERVER_PORT}`

function postGate(body) {
    const config = {
        json: body,
		responseType: 'json'
    }
    got.post(`${SERVER_URL}/gate`, config).then(res => {
        console.log('Response POST gate: ', res)
    }).catch(error => console.error('Error POST gate: ', error)) 
}
function postParkLot(body) {
    const config = {
        json: body,
		responseType: 'json'
    }
    got.post(`${SERVER_URL}/parklot`, config).then(res => {
        console.log('Response POST parklot: ', res)
    }).catch(error => console.error('Error POST parklot: ', error)) 
}

mqttServer.listen(mqttPort, function () {
  console.log('server started and listening on port ', mqttPort)
})

// fired when a client connects
aedes.on('clientConnect', function (client) {
    console.log('Client Connected: ' + (client ? client.id : client))
})
// fired when a client disconnects
aedes.on('clientDisconnect', function (client) {
    console.log('Client Disconnected: ' + (client ? client.id : client))
})

// fired when a message is published
aedes.on('publish', async function (packet, client) {
    if(packet.topic === 'gate') {
        const payload = JSON.parse(packet.payload.toString())
        console.log('Gate : ', payload);
        //postGate(payload);
    } else if(packet.topic === 'parklot') {
        const payload = JSON.parse(packet.payload.toString())
        console.log('Parklot : ', payload);
        //postParkLot(payload);
    }
})