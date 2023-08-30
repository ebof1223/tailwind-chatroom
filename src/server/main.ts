import express from "express";
import ViteExpress from "vite-express";
import { Server } from "socket.io";
import { PrismaClient } from "@prisma/client";
import { warn } from "console";

const app = express();
const prisma = new PrismaClient();
const httpServer = ViteExpress.listen(app, 3000, () =>
  console.log("ViteExpress running on http://localhost:3000")
);

const io = new Server(httpServer, {
  cors: { origin: "*" },
});

app.use(express.json());

app.post('/api/newMember', async (req, res) => {
  const { memberName } = req.body;
  try {
    const newMember = await prisma.member.create({
      data: {
        name: memberName,
      },
    });
    res.status(201).json({ newMember });
  } catch (error) {
    res.status(500).json({ error: 'Unable to create new member' });
    console.error(error);
  }
});

app.post("/api/getMemberId", async (req, res) => {
  const { memberName } = req.body;
  try {
    const member = await prisma.member.findFirst({
      where: { name: memberName }
    });
    if (member) {
      res.status(200).json({ memberId: member.id });
    } else {
      res.status(404).json({ error: "Member not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching memberId" });
    console.error(error);
  }
});

//use to get conversation id from member, ie conversations member belongs to
app.post("/api/getConversationId", async (req, res) => {
  const { memberName } = req.body;
  try {

    const member = await prisma.member.findFirst({
      where: { name: memberName }
    });

    if (member) {
      res.status(200).json({ memberId: member.id });
    } else {
      res.status(404).json({ error: "ConversationId not found" });
    }

  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching memberName" });
    console.error(error);
  }

});

app.post('/api/getConversations', async (req, res) => {
  try {
    const { memberId } = req.body;

    if (!memberId) {
      return res.status(400).json({ error: 'Member ID is required' });
    }

    const memberConversations = await prisma.memberConversation.findMany({
      where: {
        memberId: Number(memberId),
      },
      include: {
        conversation: {
          include: {
            messages: true,
            members: true,
          }
        }
      }
    });

    const conversations = memberConversations.map(mc => mc.conversation);
    console.log("conversation", conversations);

    return res.json({ conversations });
  } catch (error) {

    console.error('Error fetching conversations:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

io.on("connection", (socket) => {
  socket.on("newMessageToServer", async (data) => {
    const { memberName, memberId, conversationId, body } = data;
    try {
      // Create a new message in the database
      const newMessage = await prisma.message.create({
        data: {
          body: body, // body of the message
          senderId: memberId, // ID of the member sending the message
          conversationId: conversationId, // ID of the conversation the message belongs 

        }
      });
      if (newMessage) {
        // Emit the message to all connected clients
        io.emit("newMessageToClient", { memberName: memberName, newMessage });
      }
    } catch (error) {
      console.error(error);
    }
  });

});
