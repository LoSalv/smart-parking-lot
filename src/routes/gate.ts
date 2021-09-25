import express = require('express')
import db = require('../db/db')
const router = express.Router()
import plates = require('../plugins/plates')
import validator from "validator"

router.route('/')
.post(async (req, res, next) => {
    if (!req.body.datetime || ! req.body.image) {
        res.status(400).send('Image or datetime not present in the request')
    }

    const datetime = new Date(req.body.datetime)
    const imagedata = req.body.image
    const country_code = (req.body.country_code) ? validator.escape(req.body.country_code) : 'eu'
    const pattern_code = (req.body.pattern_code) ? '-p ' + validator.escape(req.body.pattern_code) : ''

    try {
        const plate = await plates.getPlate(imagedata, country_code, pattern_code)
        await db.addLog(datetime, plate)
        res.send(`Added log entry, plate: ${plate}`)
    } catch(err) {
        res.status(500).send()
        return
    }

})
.get(async (req, res, next) => {
    try {
        let result = await db.getGateLog()
        res.send(JSON.stringify(result))
    } catch (err) {
        res.status(500).send()
    }
})

export default router 