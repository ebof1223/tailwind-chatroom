import express from "express";
import ViteExpress from "vite-express";
import { Server } from "socket.io";
import { PrismaClient } from "@prisma/client";

const app = express();
const prisma = new PrismaClient();
const httpServer = ViteExpress.listen(app, 3000, () =>
  console.log("ViteExpress running on http://localhost:3000")
);

const io = new Server(httpServer, {
  cors: { origin: "*" },
});

app.use(express.json());

const getAllMembers = async () => {
  try {
    const members = await prisma.member.findMany();
    return members;
  } catch (error) {
    console.error(error);
  }
};

app.post('/api/newMember', async (req, res) => {
  const { memberName } = req.body;
  try {
    const newMember = await prisma.member.create({
      data: {
        name: memberName,
      },
    });
    res.status(201).json({ newMember });
    console.log(getAllMembers().then((members) => console.log(members)));
  } catch (error) {
    res.status(500).json({ error: 'Unable to create new member' });
    console.error(error);
  }
});

io.on("connection", (socket) => {
  socket.on("chatSession", async (data) => {
    console.log("data:", data);
  });
});
