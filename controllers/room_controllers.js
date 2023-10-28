const Room = require("../models/roomModel");

const createRoom = async (req, res) => {
  const { roomID, participants } = req.body;
  if (!(roomID && participants)) {
    return res.json({
      error: "Room ID and participants are mandatory to create chat room.",
    });
  }
  const findRoom = await Room.findOne({ roomID });
  if (findRoom) {
    return res.json({ error: `A room with ID ${roomID} already exists.` });
  }
  await Room.create({ roomID, participants })
    .then(() => {
      return res.json({ success: "Room created successfully." });
    })
    .catch((err) => console.log(err));
};

const joinRoom = async (req, res) => {};

module.exports = { createRoom, joinRoom };
