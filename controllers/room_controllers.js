const Room = require("../models/roomModel");

const createRoom = async (req, res) => {
  const { roomID } = req.body;
  if (!roomID) {
    return res.json({
      error: "Room ID is mandatory to create chat room.",
    });
  }
  const findRoom = await Room.findOne({ roomID });
  if (findRoom) {
    return res.json({ error: `Room ID ${roomID} already exists.` });
  }
  await Room.create({ roomID })
    .then(() => {
      return res.json({ success: "Room created successfully." });
    })
    .catch((err) => console.log(err));
};

const joinRoom = async (req, res) => {
  const { userID, roomID } = req.body;
  if (!(userID && roomID)) {
    return res.json({ error: "User ID and room ID are mandatory." });
  }
  const findRoom = await Room.findOne({ roomID });
  if (!findRoom) {
    return res.json({ error: `Room ID ${roomID} doesn't exist.` });
  }
  if (findRoom.participants.includes(userID)) {
    return res.json({
      error: `User ${userID} is already present in the room.`,
    });
  }

  findRoom.participants.push(userID);

  try {
    findRoom.save();
    return res.json({ success: `${userID} joined the room.` });
  } catch (error) {
    console.log(error);
    return res.json({ error: "Failed to join the room." });
  }
};

module.exports = { createRoom, joinRoom };
