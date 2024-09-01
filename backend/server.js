// // backend/server.js
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const connectDB = require("./config/db");
const cors = require("cors");
const roomRoutes = require("./routes/rooms");
const dotenv = require("dotenv");

dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(
  cors({
    origin: "http://localhost:3000", // Ensure this matches your frontend domain
    methods: ["GET", "POST"],
    credentials: true,
  })
);
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.use("/api/rooms", roomRoutes);

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.io
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000", // React app domain
    methods: ["GET", "POST"],
  },
});

// WebSocket Connection
io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  // Join Room
  socket.on("join-room", ({ roomId, userId }) => {
    socket.join(roomId);
    console.log(`User ${userId} joined room ${roomId}`);
    socket.to(roomId).emit("user-connected", userId);

    // Handle signaling data
    socket.on("signal", (data) => {
      io.to(data.to).emit("signal", {
        from: data.from,
        signal: data.signal,
      });
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log(`User ${userId} disconnected from room ${roomId}`);
      socket.to(roomId).emit("user-disconnected", userId);
    });
  });
});

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// // const express = require("express");
// // const connectDB = require("./config/db"); // Ensure this path is correct
// // const dotenv = require("dotenv");

// // dotenv.config();

// // const app = express();

// // // Middleware
// // app.use(express.json());

// // // Connect to MongoDB
// // connectDB(); // Ensure this is called correctly

// // app.get("/", (req, res) => {
// //   res.send("Server is running with MongoDB");
// // });

// // const PORT = process.env.PORT || 5000;
// // app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// const express = require("express");
// const http = require("http");
// const socketIo = require("socket.io");
// const cors = require("cors");
// const roomRoutes = require("./routes/rooms");
// const dotenv = require("dotenv");

// dotenv.config();

// // Initialize Express app
// const app = express();

// // Middleware
// app.use(
//   cors({
//     origin: "http://localhost:3000",
//     methods: ["GET", "POST"],
//     credentials: true,
//   })
// );
// app.use(express.json());

// // Connect to MongoDB
// // Ensure connectDB is correctly defined and imported
// connectDB();

// // Routes
// app.use("/api/rooms", roomRoutes);

// // Create HTTP server
// const server = http.createServer(app);

// // Initialize Socket.io
// const io = socketIo(server, {
//   cors: {
//     origin: "http://localhost:3000", // React app domain
//     methods: ["GET", "POST"],
//   },
// });

// // WebSocket Connection
// io.on("connection", (socket) => {
//   console.log("New client connected:", socket.id);

//   // Join Room
//   socket.on("join-room", ({ roomId, userId }) => {
//     socket.join(roomId);
//     console.log(`User ${userId} joined room ${roomId}`);
//     socket.to(roomId).emit("user-connected", userId);

//     // Handle signaling data
//     socket.on("signal", (data) => {
//       io.to(data.to).emit("signal", {
//         from: data.from,
//         signal: data.signal,
//       });
//     });

//     // Handle disconnection
//     socket.on("disconnect", () => {
//       console.log(`User ${userId} disconnected from room ${roomId}`);
//       socket.to(roomId).emit("user-disconnected", userId);
//     });
//   });
// });

// // Start Server
// const PORT = process.env.PORT || 5000;
// server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
