const express = require("express");
const path = require("path");
const http = require('http');
const { Server } = require('socket.io');
const { Player } = require("./player");
const app = express();

const server = http.createServer(app);

const io = new Server(server);

const sockets = {};

io.on("connection", socket => {
    console.log("connection");
    const { id } = socket;

    const player = new Player(id);
    sockets[id] = player;
    socket.on("info", player => {
        try {
            const { grid, lives, completed, sendableMines } = player;
            player.grid = grid;

            socket.broadcast.emit("info", player);
        } catch (e) {
            console.error(e);
        }
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