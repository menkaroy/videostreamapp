const express = require("express");
const router = express.Router();
const Room = require("../models/Room"); // Ensure this path is correct

// GET /api/rooms
router.get("/", async (req, res) => {
  try {
    const rooms = await Room.find();
    res.status(200).json(rooms);
  } catch (err) {
    console.error("Error fetching rooms:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

// POST /api/rooms/join
router.post("/join", async (req, res) => {
  try {
    const { roomId, username } = req.body;

    if (!roomId || !username) {
      return res.status(400).json({ msg: "Room ID and username are required" });
    }

    // Find the room by ID
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ msg: "Room not found" });
    }

    // Check if the user is already in the room
    if (room.users.includes(username)) {
      return res.status(400).json({ msg: "User already in room" });
    }

    // Add the user to the room
    room.users.push(username);
    await room.save();

    res.status(200).json({ msg: "Joined room successfully", room });
  } catch (err) {
    console.error("Error joining room:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

// POST /api/rooms/create
// router.post("/create", async (req, res) => {
//   try {
//     const { name, username } = req.body;
//     if (!name || !username) {
//       return res.status(400).json({ msg: "Name and username are required" });
//     }

//     const newRoom = new Room({ name, createdBy: username });
//     await newRoom.save();
//     res.status(201).json(newRoom);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ msg: "Server error" });
//   }
// });

// module.exports = router;
//correct//
// router.post("/create", async (req, res) => {
//   try {
//     const { name, username } = req.body;
//     if (!name || !username) {
//       return res.status(400).json({ msg: "Name and username are required" });
//     }

//     const newRoom = new Room({ name, createdBy: username });
//     await newRoom.save();
//     res.status(201).json(newRoom);
//   } catch (err) {
//     console.error("Error details:", err); // More detailed error log
//     res.status(500).json({ msg: "Server error", error: err.message });
//   }
// });
// module.exports = router;
///////
router.post("/create", async (req, res) => {
  try {
    const { name, username } = req.body;
    if (!name || !username) {
      return res.status(400).json({ msg: "Name and username are required" });
    }

    // Check if a room with the same name already exists
    const existingRoom = await Room.findOne({ name });
    if (existingRoom) {
      return res.status(400).json({ msg: "Room name already exists" });
    }

    // Create a new room
    const newRoom = new Room({ name, createdBy: username });
    await newRoom.save();
    res.status(201).json(newRoom);
  } catch (err) {
    console.error("Error creating room:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});
module.exports = router;
