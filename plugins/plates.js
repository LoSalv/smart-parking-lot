// docker.js

const base64Img = require('base64-img')
const path = require('path')
const uniqid = require('uniqid')
const validator = require('validator')

const fs = require('fs')
const exec = require('child_process').exec

// callback(plate, error)
function getPlate(imagedata, country_code, pattern_code, callback) {
    if (!imagedata || !validator.isBase64(imagedata)) {
        return res.status(500).json({
            error: 'No image sent'
        })
    }

    let bufferImg = Buffer.from(imagedata, "base64")
    
    let filepath = "plates.jpg"

    fs.writeFileSync(filepath, bufferImg);

    exec(`alpr -c ${country_code} ${pattern_code} -j ${filepath}`, (error, stdout, stderr) => {
        if (error) {
            callback(null, error)
            return 
        } 
        
        let result = JSON.parse(stdout)

        if (result.results.length < 1) {
            callback(null, "No plates found in image")
        }

        console.log(result)

        fs.unlink(filepath, (err) => {
            if (err) callback(null, err)
            
            callback(result.results[0].plate, null)
            return
        })
        
    })
}

module.exports = {
    getPlate
}