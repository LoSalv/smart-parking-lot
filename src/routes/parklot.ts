import express = require('express')
import db = require('../db/db')
const router = express.Router()

router.route('/').get( async (req, res) => {
    try {
        let result = await db.getParkingStatusArray()
        res.json(result)
    } catch(err) {
        console.error(err)
        res.status(500).send(err)
    }
})

router.route('/:id').get(async (req, res) => {
    const parking_id = req.params.id
    try {
        let result = await db.getParkingStatus(parking_id)
        res.send(result)
    } catch(err) {
        console.error(err)
        res.status(500).send(err)
    }
})

// router.route('/:id').put(async (req, res) => {
//     const parkingId: number = parseInt(req.params.id)
//     try {
//         let result = await db.changeParkingStatus(parkingId, req.body.isFree)
//         res.json(result)
//     } catch(err) {
//         console.error(err)
//         res.status(500).send(err)
//     }
// })

export default router