// backend/models/Room.js
// const mongoose = require("mongoose");

// const RoomSchema = new mongoose.Schema({
//   name: { type: String, required: true, unique: true },
//   users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
//   createdAt: { type: Date, default: Date.now },
// });

// module.exports = mongoose.model("Room", RoomSchema);
const mongoose = require("mongoose");

const RoomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: false, // Ensures room names are unique
  },
  createdBy: {
    type: String,
    required: true,
  },
  users: [{ type: String }], // Array of user names
});

module.exports = mongoose.model("Room", RoomSchema);
