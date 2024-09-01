// import React, { useState } from "react";
// import axios from "axios";

// const Login = ({ setUsername, setCurrentRoom }) => {
//   const [inputUsername, setInputUsername] = useState("");
//   const [roomName, setRoomName] = useState("");
//   const [message, setMessage] = useState("");
//   const [rooms, setRooms] = useState([]);

//   const fetchRooms = async () => {
//     try {
//       const res = await axios.get("http://localhost:5000/api/rooms");
//       setRooms(res.data);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const handleLogin = async () => {
//     if (!inputUsername) {
//       setMessage("Please enter a username");
//       return;
//     }
//     setUsername(inputUsername);
//     await fetchRooms();
//   };

//   //   const handleCreateRoom = async () => {
//   //     try {
//   //       const response = await fetch("http://localhost:5000/api/rooms/create", {
//   //         method: "POST",
//   //         headers: {
//   //           "Content-Type": "application/json",
//   //         },
//   //         body: JSON.stringify({
//   //           name: "Test Room", // Replace with the actual room name from your state or form
//   //           username: "JohnDoe", // Replace with the actual username from your state or form
//   //         }),
//   //       });

//   //       const data = await response.json();
//   //       if (response.ok) {
//   //         console.log("Room created:", data);
//   //       } else {
//   //         console.log("Error creating room:", data);
//   //       }
//   //     } catch (error) {
//   //       console.error("Error creating room:", error);
//   //     }
//   //   };
//   async function handleCreateRoom() {
//     try {
//       const response = await fetch("http://localhost:5000/api/rooms/create", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           name: "Room Name", // Replace with actual data
//           username: "UserName", // Replace with actual data
//         }),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         console.error("Error creating room:", errorData);
//         throw new Error(errorData.msg || "Unknown error");
//       }

//       const data = await response.json();
//       console.log("Room created successfully:", data);
//     } catch (error) {
//       console.error("Error creating room:", error.message);
//     }
//   }

//   async function handleJoinRoom(roomId, username) {
//     try {
//       const response = await axios.post(
//         "http://localhost:5000/api/rooms/join",
//         {
//           roomId,
//           username,
//         }
//       );
//       console.log("Joined room successfully:", response.data);
//     } catch (error) {
//       console.error(
//         "Error joining room:",
//         error.response ? error.response.data : error.message
//       );
//     }
//   }

//   return (
//     <div className="login-container">
//       <h2>Video Streaming App</h2>
//       {!inputUsername ? (
//         <>
//           <input
//             type="text"
//             placeholder="Enter your username"
//             value={inputUsername}
//             onChange={(e) => setInputUsername(e.target.value)}
//           />
//           <button onClick={handleLogin}>Login</button>
//           {message && <p className="error">{message}</p>}
//         </>
//       ) : (
//         <>
//           <h3>Welcome, {inputUsername}</h3>
//           <div className="room-management">
//             <h4>Create a Room</h4>
//             <input
//               type="text"
//               placeholder="Room Name"
//               value={roomName}
//               onChange={(e) => setRoomName(e.target.value)}
//             />
//             <button onClick={handleCreateRoom}>Create</button>
//           </div>
//           <div className="available-rooms">
//             <h4>Available Rooms</h4>
//             <button onClick={fetchRooms}>Refresh Rooms</button>
//             <ul>
//               {rooms.map((room) => (
//                 <li key={room._id}>
//                   {room.name} ({room.users.length} users)
//                   <button onClick={() => handleJoinRoom(room.name)}>
//                     Join
//                   </button>
//                 </li>
//               ))}
//             </ul>
//           </div>
//           {message && <p className="error">{message}</p>}
//         </>
//       )}
//     </div>
//   );
// };

// export default Login;
import React, { useState } from "react";
import axios from "axios";

const Login = ({ setUsername, setCurrentRoom }) => {
  const [inputUsername, setInputUsername] = useState("");
  const [roomName, setRoomName] = useState("");
  const [message, setMessage] = useState("");
  const [rooms, setRooms] = useState([]);

  const fetchRooms = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/rooms");
      setRooms(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogin = async () => {
    if (!inputUsername) {
      setMessage("Please enter a username");
      return;
    }
    setUsername(inputUsername);
    await fetchRooms();
  };

  const handleCreateRoom = async () => {
    if (!roomName) {
      setMessage("Room name is required");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/rooms/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: roomName,
          username: inputUsername,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error creating room:", errorData);
        throw new Error(errorData.msg || "Unknown error");
      }

      const data = await response.json();
      console.log("Room created successfully:", data);
      setRoomName(""); // Clear room name input
      await fetchRooms(); // Refresh the list of rooms
    } catch (error) {
      setMessage("Error creating room: " + error.message);
    }
  };

  const handleJoinRoom = async (roomId) => {
    if (!inputUsername) {
      setMessage("Please enter a username");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/rooms/join",
        {
          roomId,
          username: inputUsername,
        }
      );
      console.log("Joined room successfully:", response.data);
      setCurrentRoom(response.data.room); // Update current room state if needed
    } catch (error) {
      console.error(
        "Error joining room:",
        error.response ? error.response.data : error.message
      );
      setMessage(
        "Error joining room: " +
          (error.response ? error.response.data.msg : error.message)
      );
    }
  };

  return (
    <div className="login-container">
      <h2>Video Streaming App</h2>
      {!inputUsername ? (
        <>
          <input
            type="text"
            placeholder="Enter your username"
            value={inputUsername}
            onChange={(e) => setInputUsername(e.target.value)}
          />
          <button onClick={handleLogin}>Login</button>
          {message && <p className="error">{message}</p>}
        </>
      ) : (
        <>
          <h3>Welcome, {inputUsername}</h3>
          <div className="room-management">
            <h4>Create a Room</h4>
            <input
              type="text"
              placeholder="Room Name"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
            />
            <button onClick={handleCreateRoom}>Create</button>
          </div>
          <div className="available-rooms">
            <h4>Available Rooms</h4>
            <button onClick={fetchRooms}>Refresh Rooms</button>
            <ul>
              {rooms.map((room) => (
                <li key={room._id}>
                  {room.name} ({room.users.length} users)
                  <button onClick={() => handleJoinRoom(room._id)}>Join</button>
                </li>
              ))}
            </ul>
          </div>
          {message && <p className="error">{message}</p>}
        </>
      )}
    </div>
  );
};

export default Login;
