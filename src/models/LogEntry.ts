import * as mongoose from 'mongoose'

const logEntrySchema = new mongoose.Schema({
    datetime: Date,
    plate: String,
    direction: String, //'leaving' or 'entering'
    numberOfOccupiedParks: Number,
});

const LogEntry = mongoose.model('LogEntry', logEntrySchema);

export default LogEntry