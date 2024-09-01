import React, { useState } from "react";
import Login from "./components/Login";
import Room from "./components/Room";

console.log("Login Component:", Login);
console.log("Room Component:", Room);

function App() {
  const [username, setUsername] = useState("");
  const [currentRoom, setCurrentRoom] = useState(null);

  return (
    <div className="App">
      {!currentRoom ? (
        <Login setUsername={setUsername} setCurrentRoom={setCurrentRoom} />
      ) : (
        <Room currentRoom={currentRoom} username={username} />
      )}
    </div>
  );
}

export default App;
