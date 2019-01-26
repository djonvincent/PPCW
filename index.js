const app = require('./app.js');
const server = require('http').createServer(app);
const port = 3000;
server.listen(port);
