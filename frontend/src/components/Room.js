// frontend/src/components/Room.js
import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import Peer from "simple-peer";
import VideoPlayer from "./VideoPlayer";

const socket = io("http://localhost:5000");

const Room = ({ currentRoom, username }) => {
  const [peers, setPeers] = useState([]);
  const userVideo = useRef();
  const peersRef = useRef([]);
  const roomID = currentRoom._id;

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        userVideo.current.srcObject = stream;

        socket.emit("join-room", { roomId: roomID, userId: socket.id });

        socket.on("user-connected", (userId) => {
          const peer = createPeer(userId, socket.id, stream);
          peersRef.current.push({
            peerID: userId,
            peer,
          });
          setPeers((users) => [...users, peer]);
        });

        socket.on("signal", (data) => {
          const item = peersRef.current.find((p) => p.peerID === data.from);
          if (item) {
            item.peer.signal(data.signal);
          }
        });

        socket.on("user-disconnected", (userId) => {
          const peerObj = peersRef.current.find((p) => p.peerID === userId);
          if (peerObj) {
            peerObj.peer.destroy();
          }
          const peersUpdated = peers.filter((p) => p !== peerObj.peer);
          setPeers(peersUpdated);
        });
      });

    // Cleanup on component unmount
    return () => {
      socket.disconnect();
    };
    // eslint-disable-next-line
  }, []);

  const createPeer = (userToSignal, callerID, stream) => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream,
    });

    peer.on("signal", (signal) => {
      socket.emit("signal", {
        to: userToSignal,
        from: callerID,
        signal,
      });
    });

    return peer;
  };

  return (
    <div className="room-container">
      <h2>Room: {currentRoom.name}</h2>
      <div className="videos">
        <VideoPlayer stream={userVideo} muted />
        {peers.map((peer, index) => (
          <VideoPlayer key={index} peer={peer} />
        ))}
      </div>
    </div>
  );
};

export default Room;
