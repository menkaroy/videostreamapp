import React, { useEffect, useRef } from "react";

const VideoPlayer = ({ peer, stream }) => {
  const ref = useRef();

  useEffect(() => {
    if (peer) {
      peer.on("stream", (stream) => {
        ref.current.srcObject = stream;
      });
    } else if (stream) {
      ref.current.srcObject = stream.current.srcObject;
    }
  }, [peer, stream]);

  return <video playsInline autoPlay ref={ref} />;
};

export default VideoPlayer;
