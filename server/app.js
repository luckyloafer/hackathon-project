const express = require('express');
const app = express();
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST']
    }
});
//sample
io.on("connection", (socket) => {
    console.log(socket.id);

    socket.on('join_room', (data) => {
        console.log(data)
        socket.join(data);
        
    })

    socket.on('send_message', (data) => {
        console.log(data)
        socket.to(data.room).emit('received_message', data);
    })
    socket.on('disconnecting', () => {
        const rooms = Object.keys(socket.rooms);
        rooms.forEach((room) => {
            if (room !== socket.id) {
                console.log(`User ${socket.id} disconnected from room ${room}`);
                // Your custom logic here for handling user disconnection from the room
            }
        });
    });
})

server.listen(3001, () => {
    console.log('server is running');
})