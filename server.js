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
const players = {};

function leaveRooms(id) {
    rooms.forEach((room, index) => {
        if (room.includes(id)) {
            room.forEach(otherId => {
                const socket = sockets[otherId];
                if (!socket) return;
                socket.leave(index + "");
                if (otherId != id) {
                    socket.emit("gameEnd", "win");
                }
            });

            room.splice(0);
        }
    });
}

function joinRoom(socket) {
    const { id } = socket;
    const player = players[id];


    let roomIndex = rooms.findIndex(room => {
        if (room.length == 1 && !room.includes(id)) {
            const [ otherId ] = room;
            const otherPlayer = players[otherId];
            const { mode } = otherPlayer;
            console.log(mode, player.mode, mode == player.mode);
            return player.mode == mode;
        };
    });

    if (roomIndex == -1) roomIndex = rooms.findIndex(room => {
        return room.length == 0;
    });

    if (roomIndex == -1) {
        roomIndex = rooms.push([]) - 1;
    }
    const room = rooms[roomIndex];
    
    room.push(id);

    const roomName = roomIndex + "";

    socket.join(roomName);
    socket.emit("room", roomName);

    return roomName;
}

io.on("connection", socket => {
    const { id } = socket;
    sockets[id] = socket;
    players[id] = new Player(id);

    let roomName;

    socket.on("queue", mode => {
        players[id].mode = mode;
        leaveRooms(id);
        roomName = joinRoom(socket);
    })

    socket.on("info", player => {
        if (!roomName) return;
        Object.assign(players[id], player);
        try {
            socket.broadcast.to(roomName).emit("info", player);
        } catch (e) {
            console.error(e);
        }
    });

    socket.on('sendMines', amount => {
        if (!roomName) return;
        const room = rooms[+roomName];
        if (!(room && room.length == 2)) return; 

        const playerIndex = room.indexOf(id);
        if (playerIndex == -1) return;

        const otherPlayerId = room[1 - playerIndex];
        const otherPlayer = players[otherPlayerId];
        const { grid } = otherPlayer;

        const unmarkedGrid = grid.filter(s => {
            return !(s.revealed || s.mine);
        });

        const { random, floor } = Math;
        new Array(amount).fill().forEach(_ => {
            if (!unmarkedGrid.length) return;
            const index = floor(random() * unmarkedGrid.length);

            unmarkedGrid[index].mine = true;
            unmarkedGrid.splice(index, 1);
        });

        sockets[otherPlayerId].emit("updateGrid", grid);
    });

    socket.on("lost", _ => {
        // if (!roomName) return;
        roomName = undefined;
        leaveRooms(id);
    });

    socket.on("disconnect", _ => {
        leaveRooms(id);
        delete sockets[id];
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