import LogEntry from '../models/LogEntry'
import ParkStatus from '../models/ParkStatus'
import * as mongoose from 'mongoose'
import * as dateHandler from 'date-and-time'

const MONGODB_PORT: string = process.env.MONGODB_PORT || '27017'
const MONGODB_HOST: string = `mongodb://mongo:${MONGODB_PORT}`

export async function connectToDB(): Promise<any> {
    return mongoose.connect(MONGODB_HOST + '/parking-lot', { useNewUrlParser: true, useUnifiedTopology: true })   
}

export async function getParkingStatusArray(): Promise<any> {
    return ParkStatus.find()
}

export async function getParkingStatus(id): Promise<any> {
    let filter = { _id: id }
    return ParkStatus.find(filter)
}

export function changeParkingStatus(id: number, isFree: Boolean, datetime: Date): Promise<any> {
    let filter = { _id: id }
    let obj = new ParkStatus({ _id: id, free: isFree })
    return ParkStatus.replaceOne(filter, obj, { upsert: true })
}

export async function addLog(datetime: Date, plate: string, direction: string): Promise<any> {
    //checks the number of current occupied parks
    let logEntry = await LogEntry.findOne({$query: {}, $orderby: {$natural : -1}})
    let numberOfOccupiedParks
    if (logEntry == null) {
        numberOfOccupiedParks = 0 
        console.log('\tno previous entry')
    } else {
        numberOfOccupiedParks = logEntry.numberOfOccupiedParks
        console.log('\tprevious entry: ', logEntry.plate, logEntry.direction)
    }

    console.log('\tnumber of already occupied parks:', numberOfOccupiedParks)

    if (numberOfOccupiedParks == 0 && direction == 'leaving') {
        //do nothing because something is wrong
    } else if (direction == 'entering') {
        numberOfOccupiedParks ++
    } else if (direction == 'leaving') {
        numberOfOccupiedParks --
    }

    console.log('\tnumber of current occupied parks: ', numberOfOccupiedParks)

    let logObj = new LogEntry({ datetime, plate, direction, numberOfOccupiedParks })
    return logObj.save()
}

//fromHowManyDaysAgo is a negative integer number. 
//-1 - 24 hours before
//-14 - two weeks before
export function getGateLog(fromHowManyDaysAgo?: number, plate?: string): Promise<any> {
    console.log('\ttime: ', fromHowManyDaysAgo, ', plate: ', plate)
    if (!fromHowManyDaysAgo && !plate) {
        console.log('\tSending all entries')
        return LogEntry.find()
    } else if (fromHowManyDaysAgo && !plate) {
        let startDate = dateHandler.addDays(new Date(), fromHowManyDaysAgo)
        console.log('\tSending all entries from', startDate)
        return getLogEntriesInAInterval(startDate, new Date())
    } else if (fromHowManyDaysAgo && plate) {
        console.log('\tSending all entries in a temporal interval and plate')
        let startDate = dateHandler.addDays(new Date(), fromHowManyDaysAgo)
        return getLogEntriesInAIntervalAndPlate(startDate, new Date(), plate)
    } else { //!fromHowManyDaysAgo && plate
        console.log('\tSending all entries filtered by plate')
        return getLogEntriesFilteredByPlate(plate)
    }
}

function getLogEntriesInAInterval(startDate, endDate): Promise<any> {
    return LogEntry.find({datetime:{$gte:startDate,$lt:endDate}})
}

function getLogEntriesInAIntervalAndPlate(startDate, endDate, plate): Promise<any> {
    return LogEntry.find({datetime:{$gte:startDate,$lt:endDate}, plate: plate})
}

function getLogEntriesFilteredByPlate(plate): Promise<any> {
    return LogEntry.find({plate: plate})
}