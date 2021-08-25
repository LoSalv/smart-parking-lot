import * as mongoose from 'mongoose'

const logEntrySchema = new mongoose.Schema({
    datetime: Date,
    plate: String
});

const LogEntry = mongoose.model('LogEntry', logEntrySchema);

export default LogEntry