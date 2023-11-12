const Message = require("../models/messageModel");
const Rooms = require("../models/roomModel");
const { emitSocketEvent } = require("../socketIO/socketIO");

const sendMessage = async (req, res) => {
  const { roomID, message } = req.body;
  if (!(roomID && message)) {
    return res.status(400).json({
      error: "Room ID and message are mandatory.",
    });
  }

  const isRoomExist = await Rooms.findOne({ roomID });
  if (!isRoomExist) {
    return res.status(406).json({ error: `Room ${roomID} doesn't exist.` });
  }

  const messageDetails = {
    roomID,
    userID: req.user._id,
    message,
  };

  const room = await Rooms.findOne({ roomID });

  //   emit message to everyone in the room except the sender
  room.participants.forEach((user) => {
    if (user !== req.user._id) {
      emitSocketEvent(req, user.toString(), "newRoomMessage", messageDetails);
    }
  });

  //   create the message in DB
  await Message.create(messageDetails)
    .then(() => {
      return res.status(201).json({ success: "Message sent successfully." });
    })
    .catch((err) => console.log(err));
};

module.exports = { sendMessage };
