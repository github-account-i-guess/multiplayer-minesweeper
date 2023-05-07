const express = require("express");
const path = require("path");
const http = require('http');
const app = express();

app.use("/static", express.static(path.join(__dirname, "./static")));

app.get("/*", async(req, res, next) => {
    res.sendFile(path.resolve(__dirname, `index.html`));
});

const server = http.createServer(app);

server.listen(8081, _ => {
    console.log("\n\n\n", "Server Running");
}).on("error", e => {
    console.error(e);
}).on("close", _ => {
    console.log(`Server "Closed"`);
});