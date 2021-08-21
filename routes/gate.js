const express = require('express')
const db = require('../db/db')
const router = express.Router()
const plates = require('../plugins/plates')
const validator = require('validator')

router.route('/').post((req, res, next) => {
    const imagedata = req.body.image
    const country_code = (req.body.country_code) ? validator.escape(req.body.country_code) : 'eu'
    const pattern_code = (req.body.pattern_code) ? '-p ' + validator.escape(req.body.pattern_code) : ''

    let plate

    plates.getPlate(imagedata, country_code, pattern_code, (plate, error) => {
        if (error) {
            console.log("Error in plates.getPlate: " + error); 
            res.status(500).send(error)
        }

        console.log("Plate: " + plate)
        res.send(plate)
    })
})

module.exports = router 