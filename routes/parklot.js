const express = require('express')
const db = require('../db/db')
const router = express.Router()

router.route('/').get((req, res) => {
    let statusArray = db.getParkingStatusArray()
    let statusJson = JSON.stringify(statusArray)
    console.log(statusJson)
    res.json(statusJson)
})

router.route('/:id').get((req, res) => {
    const parking_id = req.params.id
    res.send(db.getParkingStatus(parking_id))
})

router.route('/:id').put((req, res) => {
    const parking_id = req.params.id
    db.changeParkingStatus(parking_id, req.body.isFree)
    res.send()
})

module.exports = router 