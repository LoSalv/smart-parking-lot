const mqtt = require('mqtt');
const uuid = require("uuid");
const TOTAL_PARKLOTS = 100;
 
const settings = {
	port: 1883
};
const client = mqtt.connect('mqtt://127.0.0.1', settings);

const cars = [];
// 1 = available, 0 = occupied
const availableLots = Array(TOTAL_PARKLOTS).fill(1);

let day = '1-1-2021';
let hour = 0;
let minutes = 0;
function updateDay() {
	const split = day.split('-');
	day = (split[0]+1) + '-' + split[1] + '-' + split[2]
}
function updateTime() {
	minutes++;
	if(minutes === 60) {
		minutes = 0;
		hour++;
		if(hour === 24) {
			updateDay();
			hour = 0;
		}
	}
}

// Returns a random number between min and max
function generateRandom(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1) + min);
}
function generateLicensePlate() {
	return uuid.v4();
}
function getParkLot() {
	let number = generateRandom(0, TOTAL_PARKLOTS-1);
	while(!availableLots[number]) {
		number = generateRandom(0, TOTAL_PARKLOTS-1);
	}
	return number;
}

function gate() {
	const entered = generateRandom(0, 1);
	if(entered) {
		const plate = generateLicensePlate();
		const parkLot = getParkLot();
		cars.push({
			plate: plate,
			parkLot: parkLot
		});
		const date = `${day} ${hour}:${minutes}`;
		publishGate(date, plate);
		setTimeout(() => publishParkLot(parkLot, plate), 300);
	} else {
		const exitedCarIndex = generateRandom(0, cars.length);
		const exitedCar = cars[exitedCarIndex];
		cars.splice(exitedCarIndex, 1);
	}
}

function simulateGateAndParkLots() {
	const minutes = 60; //ms
	setInterval(updateTime, minutes);
	// every ten minutes a car enter or exit
	setInterval(gate, 600);
}

function publishGate(date, licensePlate) {
	console.log('Publishing GATE: ', date, ', plate: ', licensePlate);
	client.publish('gate', JSON.stringify({
		date: date,
		plate: licensePlate
	}));
}
function publishParkLot(parkLot, licensePlate) {
	console.log('Publishing PARKLOT: ', parkLot, ', plate: ', licensePlate);
	client.publish('parklot', JSON.stringify({ 
		number: parkLot,
		plate: licensePlate
	}));
}


simulateGateAndParkLots();