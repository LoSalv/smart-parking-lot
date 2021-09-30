const mqtt = require('mqtt');
const dateHandler = require('date-and-time');
const fs = require('fs');

const TOTAL_PARKLOTS = 40;
const PLATES = 7;

//enum 
const Direction = {
	'LEAVING': 'leaving',
	'ENTERING': 'entering'
}

Object.freeze(Direction)

const settings = {
	port: 1883
};
const client = mqtt.connect('mqtt://127.0.0.1', settings);

const cars = [];
const freePlates =  Array(PLATES).fill(true)
const availableLots = Array(TOTAL_PARKLOTS).fill(true);
let date;

// Returns a random number between min and max included
function generateRandom(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1) + min);
}
function getParkLot() {
	let number = generateRandom(0, TOTAL_PARKLOTS-1);
	while(!availableLots[number]) {
		number = generateRandom(0, TOTAL_PARKLOTS-1);
	}
	return number;
}

function gate() {
	const entered = generateRandom(0, 4);
	if(entered != 0 && entered != 1) {
		if(cars.length !== TOTAL_PARKLOTS) {
			const plate = freePlates.findIndex(p => p === true);
			if(plate !== -1) {
				const parkLot = getParkLot();
				
				freePlates[plate] = false;
				availableLots[parkLot] = false;

				cars.push({ plate: plate, parkLot })

				publishGate(date, plate, Direction.ENTERING);
				setTimeout(() => publishParkLot(parkLot, false), 300);
			}
		}
	} else {
		if(cars.length > 0) {
			const exitedCarIndex = generateRandom(0, cars.length-1);
			const exitedCar = cars[exitedCarIndex];

			freePlates[exitedCar.plate] = true;
			availableLots[exitedCar.parkLot] = true;
			cars.splice(exitedCarIndex, 1);

			publishGate(date, exitedCar.plate, Direction.LEAVING);
			publishParkLot(exitedCar.plate, true);
		}
	}
}

function simulateGateAndParkLots() {
	const minutes = 60; //ms

	date = dateHandler.addDays(new Date(), -14)
	console.log("Simulating data from ", dateHandler.format(date, 'YYYY/MM/DD HH:mm'))

	setInterval(() => date = dateHandler.addMinutes(date, 1), minutes);
	// every ten minutes a car enter or exit
	setInterval(gate, 600);
}

function publishGate(currDate, licensePlate, direction) {
	const imageName = `plate${licensePlate}.jpg`
	console.log('Publishing GATE: ', dateHandler.format(currDate, 'YYYY/MM/DD HH:mm'), 
	', plate: ', imageName, ', ', direction);

	client.publish('gate', JSON.stringify({
		datetime: dateHandler.format(currDate, 'YYYY/MM/DD HH:mm'),
		plate: fs.readFileSync('./src/test/plates/'+imageName).toString('base64'),
		fileName: imageName,
		direction: direction
	}));
}
function publishParkLot(parkLot, isFree) {
	console.log('Publishing PARKLOT: ', parkLot, ', isFree: ', isFree);

	client.publish('parklot', JSON.stringify({ 
		parkNumber: parkLot, isFree
	}));
}

simulateGateAndParkLots();

//module.exports = publishGate