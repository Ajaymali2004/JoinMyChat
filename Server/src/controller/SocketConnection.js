const { Chat } = require("../modal/Chat");

const connection = (socket, io) => {

  socket.on("joinRoom", async (data) => {
    const {room , username} = data;
    try {
      if (!room) {
        console.log(" Room not provided");
        return;
      }
      socket.join(room);
      const chatHistory = await Chat.find({ room }).sort({ timestamp: 1 });
      socket.emit("PrevMessages", chatHistory);
    } catch (error) {
      console.log(" Error in joinRoom:", error);
    }
  });

  socket.on("chatMessage", async (data) => {
    try {
      const { room, message,username } = data;

      if (!room || !message) {
        console.log(" Missing room or message");
        return;
      }

      const newMessage = new Chat({ room, username, message });
      await newMessage.save();

      io.to(room).emit("chatMessage", newMessage);
    } catch (error) {
      console.log(" Error in chatMessage:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log(` User disconnected`);
  });
};

module.exports = { connection };
