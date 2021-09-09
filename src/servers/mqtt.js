const aedes = require('aedes')()
const mqttServer = require('net').createServer(aedes.handle)
const mqttPort = 1883

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
        mqttServer.publish({ topic: 'lala', payload })
    } else if(packet.topic === 'parklot') {
        const payload = JSON.parse(packet.payload.toString())
        console.log('Parklot : ', payload);
        mqttServer.publish({ topic: 'eehhh', payload })
    }
})