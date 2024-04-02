// create web server
// create a new instance of express
const express = require('express');
const app = express();
// create a new instance of http
const http = require('http');
// create a new instance of socket.io
const socketIo = require('socket.io');

// create a new http server
const server = http.createServer(app);
// create a new socket.io server
const io = socketIo(server);

// the port we are listening to
const port = 3000;

// middleware
app.use(express.static(__dirname + '/public'));

// the route for the server
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// the server listens for a connection
io.on('connection', (socket) => {
    console.log('a user connected');

    // the server listens for a message
    socket.on('message', (msg) => {
        console.log('message: ' + msg);
        // the server sends the message to all connected clients
        io.emit('message', msg);
    });

    // the server listens for a disconnection
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

// the server listens for connections on the port
server.listen(port, () => {
    console.log('listening on *:' + port);
});