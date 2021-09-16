import httpServer from './servers/http'
import * as db from './db/db'
import * as mqttServer from './servers/mqtt'
require('source-map-support').install();

const PORT = process.env.PORT || 8124
const mqttPort = 1883

;(async () => {
  try {
    await db.connectToDB()
  }
  catch(err) {
    console.error(err)
  }

  mqttServer.listen(mqttPort, function () {
    console.log('MQTT server started and listening on port ', mqttPort)
  })

  const server = httpServer.listen(PORT, function () {
    console.info('Your WoT server is up and running on port %s', PORT);
  });
})()




