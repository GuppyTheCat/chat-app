var server = require('http').createServer();
var io = module.exports.io = require('socket.io')(server);

const PORT = process.env.PORT || 3333;

const SocketManager = require('./SocketManager');

io.on('connection', SocketManager);

server.listen(PORT, () => console.log(`Listening on port: ${PORT}`));