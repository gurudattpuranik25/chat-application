const Message = require("../models/messageModel");
const Room = require("../models/roomModel");
const { emitSocketEvent } = require("../socketIO/socketIO");

const sendMessage = async (req, res) => {
  const { roomID, message } = req.body;
  if (!(roomID && message)) {
    return res.status(400).json({
      error: "Room ID and message are mandatory.",
    });
  }

  const room = await Room.findOne({ roomID });
  if (!room) {
    return res.status(406).json({ error: `Room ${roomID} doesn't exist.` });
  }

  const messageDetails = {
    roomID,
    userID: req.user._id,
    message,
  };

  //   emit message to everyone in the room except the sender
  room.participants.forEach((userID) => {
    if (userID !== req.user._id) {
      try {
        emitSocketEvent(req, userID, "newRoomMessage", messageDetails);
      } catch (error) {
        console.error("Error emitting newRoomMessage:", error);
      }
    }
  });

  //   create the message in DB
  await Message.create(messageDetails)
    .then(() => {
      return res.status(201).json({ success: "Message sent successfully." });
    })
    .catch((err) => console.log(err));
};

// get message history by room ID
const getMessageHistory = async (req, res) => {
  const { roomID } = req.body;
  if (!roomID) {
    return res.status(400).json({ error: "Please provide room ID." });
  }
  const messages = await Message.find({ roomID });

  if (messages.length === 0) {
    return res.status(400).json({ error: "No messages found." });
  }

  const history = messages.map((message) => {
    return `User ID : ${message._id}, message : ${message.message}`;
  });
  return res.status(200).json(history);
};

module.exports = { sendMessage, getMessageHistory };
