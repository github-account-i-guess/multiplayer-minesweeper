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

function leaveRooms(id) {
    rooms.forEach((room, index) => {
        if (room.includes(id)) {
            room.forEach(id => {
                const socket = sockets[id];
                socket.leave(index + "");
                socket.emit("game end", "win");
            });

            room.splice(0);
        }
    });

    // console.log(id, "left",  rooms);

}

function joinRoom(socket) {
    const { id } = socket;


    let roomIndex = rooms.findIndex(room => {
        return room.length == 1 && !room.includes(id);
    });

    if (roomIndex == -1) roomIndex = rooms.findIndex(room => {
        return room.length < 2;
    });

    if (roomIndex == -1) {
        roomIndex = rooms.push([]) - 1;
    }
    const room = rooms[roomIndex];
    
    room.push(id);

    // console.log(id, "joined", rooms);

    const roomName = roomIndex + "";

    socket.join(roomName);
    // console.log(id, "joining room: ", roomIndex);

    socket.emit("room", roomName);

    return roomName;
}

io.on("connection", socket => {
    const { id } = socket;
    sockets[id] = socket;

    let roomName;

    socket.on("queue", _ => {
        leaveRooms(id);
        roomName = joinRoom(socket);
    })

    socket.on("info", player => {
        if (!roomName) return;
        try {
            socket.broadcast.to(roomName).emit("info", player);
        } catch (e) {
            console.error(e);
        }
    });

    socket.on("lost", _ => {
        // if (!roomName) return;
        roomName = undefined;
        leaveRooms(id);
    });

    socket.on("disconnect", _ => {
        delete sockets[id];
        leaveRooms(id);
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