// https://github.com/moscajs/aedes/blob/eaf1ac9a79c5bbe0ed51bce06fe9c6571fd61769/examples/clusters/index.js#L7

const aedes = require('aedes')()
const server = require('net').createServer(aedes.handle)
const port = 1883

server.listen(port, function () {
  console.log('server started and listening on port ', port)
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
        console.log('Gate : ', packet.payload.toString());
    } else if(packet.topic === 'parklot') {
        console.log('Parklot : ', packet.payload.toString());
    }
    
})