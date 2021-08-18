// Load the http server and the model
const httpServer = require('./servers/http.js');
// const resources = require('./resources/model');

const PORT = 8124

// Start the HTTP server by invoking listen() on the Express application
const server = httpServer.listen(PORT, function () {
  // Once the server is started the callback is invoked
  console.info('Your WoT server is up and running on port %s', PORT);
});