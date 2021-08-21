const express = require('express');
const parkingLotRoutes = require('../routes/parklot')
const gateRoutes = require('../routes/gate')

const app = express();

// Add the bodyParser to the chain
// As the bodyParse middleware get information from
// the request useful for other middleware make sure you add it first
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({
    extended: true
}));

function printReq() {
    return function (req, res, next) {
        console.log("Request body: " + JSON.stringify(req.body));
        console.log("Request headers: " + JSON.stringify(req.headers));
        if (req.query) console.log("Request query: " + JSON.stringify(req.query));
        next()
    }
}

app.use(printReq())

app.get('/', function (req, res) {
    res.send('Server\'s up.')
});

app.use('/gate', gateRoutes)

app.use('/parklot', parkingLotRoutes)

module.exports = app;