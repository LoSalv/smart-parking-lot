import LogEntry from '../models/LogEntry'
import ParkStatus from '../models/ParkStatus'
import * as mongoose from 'mongoose'

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

export function changeParkingStatus(id: number, isFree: Boolean): Promise<any> {
    let filter = { _id: id }
    let obj = new ParkStatus({ _id: id, free: isFree })
    return ParkStatus.replaceOne(filter, obj, { upsert: true })
}

export async function addLog(datetime, plate): Promise<any> {
    let logObj = new LogEntry({ datetime, plate })
    return logObj.save()
}

export function getGateLog(): Promise<any> {
    return LogEntry.find()
}