import express from "express";
import ViteExpress from "vite-express";
import { Server } from "socket.io";
import { PrismaClient, Message } from "@prisma/client";

const app = express();
const prisma = new PrismaClient();
const getAllMembers = async () => {
  try {
    const members = await prisma.message.findMany();
    console.log(members);
  } catch (error) {
    console.log(error);
  }
};

const httpServer = ViteExpress.listen(app, 3000, () =>
  console.log("Server is listening!")
);

console.log(getAllMembers());

const io = new Server(httpServer, {
  cors: { origin: "*" },
});

io.on("connection", (socket) => {
  socket.on("message", async (data) => {
    const { sender, message } = data;
    const senderId = 1;
    const conversationId = 1;
    try {
      const newMessage = await prisma.message.create({
        data: {
          message: message,
          sender: {
            connect: {
              id: senderId, 
            },
          },
          conversation: {
            connect: {
              id: conversationId, 
            },
          },
        },
      });
      io.emit("new-message", newMessage);
    } catch (error) {
      console.log("Failed to send message, ERROR:", error);
    }
  });
  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});
