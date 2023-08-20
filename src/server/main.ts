import express from "express";
import ViteExpress from "vite-express";
import { Server } from "socket.io";

const app = express();

const httpServer = ViteExpress.listen(app, 3000, () =>
  console.log("Server is listening!")
);

const io = new Server(httpServer, {
  cors: { origin: "*" },
});

io.on("connection", (socket) => {
  socket.on("message", (arg) => {
    console.log(arg);
  });
});
