require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const { DbConnection } = require("./DbConnection");
const router = require("./src/routes/auth");
const { connection } = require("./src/controller/SocketConnection");

const app = express();
app.use(express.json());
app.use("/auth", router);

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());

DbConnection();
// NeW Socket connecting...
io.on("connection", (socket) =>{
  connection(socket,io);
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
