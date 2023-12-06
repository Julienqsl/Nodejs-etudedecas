const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const NotFoundError = require("./errors/not-found");
const userRouter = require("./api/users/users.router");
const usersController = require("./api/users/users.controller");
const authMiddleware = require("./middlewares/auth");
const app = express();
const socketIo = require("socket.io");
const articlesRouter = require("./api/articles/articles.router");

const server = http.createServer(app);
const io = new Server(server);

app.use(express.json());
app.use("/api/articles", articlesRouter);

io.on("connection", (socket) => {
  console.log("Nouveau client connecté");
  // Vous pouvez ajouter des gestionnaires d'événements ici si nécessaire
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Serveur en écoute sur le port ${PORT}`);
});


io.on("connection", (socket) => {
  console.log("a user connected");
  /*socket.on("my_event", (data) => {
    console.log(data);
  });
  io.emit("event_from_server", { test: "foo" });*/
});

app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use(cors());
app.use(express.json());

app.use("/api/users", authMiddleware, userRouter);
app.post("/login", usersController.login);

app.use("/", express.static("public"));

app.use((req, res, next) => {
  next(new NotFoundError());
});

app.use((error, req, res, next) => {
  const status = error.status || 500;
  const message = error.message;
  res.status(status);
  res.json({
    status,
    message,
  });
});

module.exports = {
  app,
  server,
};
