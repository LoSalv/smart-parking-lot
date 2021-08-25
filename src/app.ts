import httpServer from './servers/http'
import * as db from './db/db'
require('source-map-support').install();

const PORT = process.env.PORT || 8124

;(async () => {
  try {
    await db.connectToDB()
  }
  catch(err) {
    console.error(err)
  }

  const server = httpServer.listen(PORT, function () {
    console.info('Your WoT server is up and running on port %s', PORT);
  });
})()




