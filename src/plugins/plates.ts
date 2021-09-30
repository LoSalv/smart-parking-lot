// docker.js
import validator from "validator"
import { promises as fsPromises } from 'fs'
const util = require('util')

const exec = util.promisify(require('child_process').exec)

export async function getPlate(imagedata:string, country_code:string, pattern_code:string) : Promise<string> {
    if (!imagedata || !validator.isBase64(imagedata)) {
        throw 'No image to analyze'
    }

    let bufferImg = Buffer.from(imagedata, "base64")
    
    let filepath = "plates.jpg"

    if (country_code != '') {
        country_code = ' -c ' + country_code
    }  

    await fsPromises.writeFile(filepath, bufferImg)

    return new Promise((resolve, reject) => {
        exec(`alpr -c 'eu' ${pattern_code} -j ${filepath}`, async (error, stdout, stderr) => {
            if (error) {
                reject(error)
            }
            
            let result = JSON.parse(stdout)
    
            if (result.results.length < 1) {
                reject ("No plates found in image") 
            }
            
            try {
                await fsPromises.unlink(filepath)
            }
            catch (err) {
                reject(err)
            }
            resolve(result.results[0] == null? '' : result.results[0].plate)   
        })
    })
}