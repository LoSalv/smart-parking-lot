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
// Since it's a simulation, we are going to ignore leap years
function updateDay() {
	const split = day.split('-');
	let currDay = split[0]
	let currMonth = split[1]
	let currYear = split[2]
	currDay++
	switch(currDay) {
		case 28:
			if(currMonth === 2) {
				currMonth++;
				currDay = 1;
			} break;
		case 30:
			if(currMonth === 4 || currMonth === 6 || currMonth === 9 || currMonth === 11) {
				currMonth++;
				currDay = 1;
			} break;
		case 31:
			currMonth++;
			currDay = 1;
	}
	if(currMonth === 12) {
		currYear++
		currMonth = 1;
		currDay = 1;
	}
	day = `${currDay}-${currMonth}-${currYear}`
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

// Returns a random number between min and max included
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
	const entered = generateRandom(0, 4);
	const date = `${day} ${hour}:${minutes}`;
	if(entered != 0 && entered != 1) {
		if(cars.length !== TOTAL_PARKLOTS) {
			const plate = generateLicensePlate();
			const parkLot = getParkLot();
			cars.push({
				plate: plate,
				parkLot: parkLot
			});
			publishGate(date, plate);
			setTimeout(() => publishParkLot(parkLot, plate), 300);
		}
	} else {
		if(cars.length > 0) {
			const exitedCarIndex = generateRandom(0, cars.length-1);
			console.log('CAR LENGTH: ', cars.length);
			const exitedCar = cars[exitedCarIndex];
			cars.splice(exitedCarIndex, 1);
			publishGate(date, exitedCar.plate);
		}
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