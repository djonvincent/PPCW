const app = require('./app.js');
const server = require('http').createServer(app);
const port = process.env.PORT || 3000;
server.listen(port);
console.log('Running at http://127.0.0.1:' + port);
