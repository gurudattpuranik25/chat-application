const Room = require("../models/roomModel");

let userID;

const setupSocketIO = (io) => {
  io.on("connection", async (socket) => {
    console.log("User connected");
    userID = socket.id;
    socket.on("message", (message) => {
      socket.broadcast.emit("message", message);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });
};

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
  await Room.create({ roomID, participants: [userID] })
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

  const result = await Room.aggregate([
    { $unwind: "$participants" },
    {
      $group: {
        _id: null,
        allParticipants: { $addToSet: "$participants" },
      },
    },
  ]);
  const participantsList = result[0].allParticipants;
  if (participantsList.includes(userID)) {
    return res.json({
      error: `${userID} is already present in an existing room.`,
    });
  }

  const room = await Room.findOne({ roomID });
  if (!room) {
    return res.json({ error: `Room ID ${roomID} doesn't exist.` });
  }
  if (room.participants.length === 10) {
    return res.json({ error: "Room is full, try after some time." });
  }

  await room.participants.push(userID);

  try {
    await room.save();
    return res.json({ success: `${userID} joined the room.` });
  } catch (error) {
    console.log(error);
    return res.json({ error: "Failed to join the room." });
  }
};

module.exports = { createRoom, joinRoom, setupSocketIO };
