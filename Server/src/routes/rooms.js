const express = require("express");
const { v4: uuidv4 } = require("uuid");
const { Chat } = require("../modal/Chat");

const room = express.Router();
const create = async (req, res) => {
  try {
    const room = uuidv4();
    const defaultMssg = new Chat({ room,username:"JoinMyChat",message: "Wellcome to the room" });
    await defaultMssg.save();
    res.status(201).json({ room });
  } catch (error) {
    res.status(500).json({ error: "Error creating room" });
  }
};
const validateRoom = async (req, res) => {
  try {
    const { room } = req.body;

    if (!room) {
      return res.status(400).json({ message: "Room is required." });
    }

    const chatExists = await Chat.exists({ room });

    if (chatExists) {
      return res
        .status(200)
        .json({ message: "Chats exist in this room.", exists: true });
    } else {
      return res
        .status(200)
        .json({ message: "No chats found in this room.", exists: false });
    }
  } catch (error) {
    console.error("Error validating room:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};
room.get("/create", create);
room.post("/validate", validateRoom);

module.exports = room;
