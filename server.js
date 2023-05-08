const express = require("express");
const path = require("path");
const http = require('http');
const { Server } = require('socket.io');
const { Player } = require("./player");
const { copyFileSync } = require("fs");
const app = express();

const server = http.createServer(app);

const io = new Server(server);

const sockets = {};
const rooms = [];

io.on("connection", socket => {
    const { id } = socket;
    sockets[id] = socket;

    let roomIndex = rooms.findIndex(room => {
        return room.length < 2;
    });

    if (roomIndex == -1) {
        roomIndex = rooms.push([]) - 1;
    }
    const room = rooms[roomIndex];
    room.push(id);
    
    const roomName = "Room: " + roomIndex;
    socket.join(roomName);

    socket.emit("room", roomName);

    socket.on("info", player => {
        try {
            socket.broadcast.to(roomName).emit("info", player);
        } catch (e) {
            console.error(e);
        }
    });

    socket.on("disconnect", _ => {
        delete sockets[id];
        rooms.forEach(room => {
            if (room.includes(id)) {
                room.splice(room.indexOf(id));
            }
        });
        io.emit("player-disconnected");
    });
});

app.use("/static", express.static(path.join(__dirname, "./static")));

app.get("/*", async(req, res, next) => {
    res.sendFile(path.resolve(__dirname, `index.html`));
});

server.listen(8081, _ => {
    console.log("\n\n\n", "Server Running");
}).on("error", e => {
    console.error(e);
}).on("close", _ => {
    console.log(`Server "Closed"`);
});