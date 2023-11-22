const Room = require("../models/roomModel");
const Session = require("../models/userSessionModel");
const User = require("../models/userModel");
const { emitSocketEvent } = require("../socketIO/socketIO");

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

  const room = await Room.findOne({ roomID });
  if (!room) {
    return res.status(400).json({ error: `Room ID ${roomID} doesn't exist.` });
  }
  if (room.participants.length === 10) {
    return res
      .status(400)
      .json({ error: "Room is full, try after some time." });
  }

  try {
    const findUser = await User.findById(userID);
    if (findUser === null) {
      return res.status(400).json({
        error: `${userID} is not registered. Please register and try again.`,
      });
    }
    const sessionID = findUser.email;
    const isLoggedIn = await Session.findOne({ sessionID });
    if (!isLoggedIn) {
      return res
        .status(400)
        .json({ error: "Kindly login before joining the room." });
    }
  } catch (error) {
    console.log(error);
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

  // add the incoming user to the participants array
  await room.participants.push(userID);

  // notify users about new joiners
  room.participants.forEach((userID) => {
    if (userID !== req.user._id) {
      const userObj = {
        id: req.user._id,
        name: req.user.name,
      };
      emitSocketEvent(req, userID, "newUserJoined", userObj);
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

// leave room controller
const leaveRoom = async (req, res) => {
  const { userID, roomID } = req.body;
  if (!(userID && roomID)) {
    return res
      .status(400)
      .json({ error: "User ID and room ID are mandatory." });
  }
  // check if room exists or not
  const room = await Room.findOne({ roomID });
  if (!room) {
    return res.status(400).json({ error: `Room ID ${roomID} doesn't exist.` });
  }
  // check if the user is present in the room or not
  if (!room.participants.includes(userID)) {
    return res
      .status(400)
      .json({ error: `${userID} is not present in the room.` });
  }
  // delete user from the room
  try {
    await Room.updateOne(
      { roomID },
      {
        $pull: {
          participants: userID,
        },
      }
    );
    return res.status(200).json({ success: `${userID} left the room.` });
  } catch {
    return res
      .status(500)
      .json({ error: `${userID} failed to leave the room.` });
  }
};

module.exports = { createRoom, joinRoom, leaveRoom };
