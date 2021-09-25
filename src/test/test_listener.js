var mqtt = require('mqtt');

var Topic = '#'; //subscribe to all topics
var Broker_URL = 'mqtt://localhost';

var options = {
	port: 1883,
	keepalive : 0
};

var client  = mqtt.connect(Broker_URL, options);
client.on('connect', function () {
    // client.subscribe('gate_data', (err) => {
    //     if (!err) console.log('Subscribed to gate_data')
    // })
    // client.subscribe('parklot_data', (err) => {
    //     if (!err) console.log('Subscribed to parklot_data')
    // })
    client.subscribe('#', (err) => {
        if (!err) console.log('Subscribed to parklot_data')
    })
})
client.on('reconnect', mqtt_reconnect);
client.on('error', mqtt_error);
client.on('message', mqtt_messsageReceived);
client.on('close', mqtt_close);

function mqtt_reconnect(err) {
    console.log("Reconnect MQTT");
    if (err) {console.log(err);}
    client  = mqtt.connect(Broker_URL, options);
}

function mqtt_error(err) {
    console.log("Error!");
    if (err) {console.log(err);}
}

function mqtt_messsageReceived(topic, message, packet) {
    const data = JSON.parse(message)
    console.log('Topic=' +  topic + '  Message=' + message);
}

function mqtt_close() {
	console.log("Close MQTT");
}