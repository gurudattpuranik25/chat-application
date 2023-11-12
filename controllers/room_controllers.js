const Room = require("../models/roomModel");
const { emitSocketEvent } = require("../socketIO/connectSocketIO");

// create room controller
const createRoom = async (req, res) => {
  const { roomID } = req.body;
  if (!roomID) {
    return res.status(400).json({
      error: "Room ID is mandatory to create chat room.",
    });
  }
  // check if a room with same ID already exists in the database or not
  const findRoom = await Room.findOne({ roomID });
  if (findRoom) {
    return res.status(406).json({ error: `Room ID ${roomID} already exists.` });
  }
  // create a room and add the current user as its first participant
  await Room.create({ roomID, participants: [req.user._id] })
    .then(() => {
      return res.status(201).json({ success: "Room created successfully." });
    })
    .catch((err) => console.log(err));
};

// join room controller
const joinRoom = async (req, res) => {
  const { userID, roomID } = req.body;
  if (!(userID && roomID)) {
    return res
      .status(400)
      .json({ error: "User ID and room ID are mandatory." });
  }

  // get the list of participants from all the rooms
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
  // check if the incoming participant has already joined an exisiting room or not
  if (participantsList.includes(userID)) {
    return res.status(406).json({
      error: `${userID} is already present in an existing room.`,
    });
  }

  const room = await Room.findOne({ roomID });
  if (!room) {
    return res.status(400).json({ error: `Room ID ${roomID} doesn't exist.` });
  }
  if (room.participants.length === 10) {
    return res
      .status(400)
      .json({ error: "Room is full, try after some time." });
  }
  // add the incoming user to the participants array
  await room.participants.push(userID);

  // notify users about new joiners
  room.participants.forEach((user) => {
    if (user.id !== req.user._id) {
      const userObj = {
        id: req.user._id,
        name: req.user.name,
      };
      emitSocketEvent(req, user.toString(), "newUserJoined", userObj);
    }
  });

  // save the details
  try {
    await room.save();
    return res.status(200).json({ success: `${userID} joined the room.` });
  } catch (error) {
    return res.status(500).json({ error: "Failed to join the room." });
  }
};

module.exports = { createRoom, joinRoom };
