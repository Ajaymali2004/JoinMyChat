const { Chat } = require("../models/Chat");

const connection = (socket, io) => {
  console.log(`✅ Authenticated user: ${username}`);

  socket.on("joinRoom", async (data) => {
    try {
      data = JSON.parse(data);
      const { room } = data;
      if (!room) {
        console.log("❌ Room not provided");
        return;
      }

      socket.join(room);
      console.log(`✅ ${username} joined room: ${room}`);

      // Fetch chat history
      const chatHistory = await Chat.find({ room }).sort({ timestamp: 1 });
      socket.emit("PrevMessages", chatHistory);
    } catch (error) {
      console.log("Error in joinRoom:", error);
    }
  });

  socket.on("chatMessage", async (data) => {
    try {
      data = JSON.parse(data);
      const { room, message } = data;

      if (!room || !message) {
        console.log("No message or Room");
        return;
      }

      const newMessage = new Chat({ room, username, message });
      await newMessage.save();

      io.to(room).emit("chatMessage", newMessage);
    } catch (error) {
      console.log("Error in chatMessage:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log(`User ${username} disconnected`);
  });
};

module.exports = { connection };
