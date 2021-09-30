import * as mongoose from 'mongoose'

const parkStatusSchema = new mongoose.Schema({
    _id: Number,
    free: Boolean
});

const ParkStatus = mongoose.model('ParkStatus', parkStatusSchema);

export default ParkStatus