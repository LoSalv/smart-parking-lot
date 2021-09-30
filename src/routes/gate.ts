import express = require('express')
import db = require('../db/db')
const router = express.Router()
import plates = require('../plugins/plates')
import validator from "validator"

router.route('/')
.get(async (req, res, next) => {
    try {
        let result = await db.getGateLog()
        res.send(JSON.stringify(result))
    } catch (err) {
        res.status(500).send()
    }
})

router.route('/time/:fromWhen').get(async (req, res, next) => {
    try {
        let fromWhen = req.params.fromWhen
        let result = await db.getGateLog(+fromWhen)
        res.send(JSON.stringify(result))
    } catch (err) {
        res.status(500).send()
    }
})

router.route('/plate/:plate').get(async (req, res, next) => {
    try {
        let plate = req.params.plate
        let result = await db.getGateLog(null, plate)
        res.send(JSON.stringify(result))
    } catch (err) {
        res.status(500).send()
    }
})

router.route('/multiple/:fromWhen/:plate').get(async (req, res, next) => {
    try {
        let fromWhen = req.params.fromWhen
        let plate = req.params.plate
        let result = await db.getGateLog(+fromWhen, plate)
        res.send(JSON.stringify(result))
    } catch (err) {
        res.status(500).send()
    }
})

export default router 