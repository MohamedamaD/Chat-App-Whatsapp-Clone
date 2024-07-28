import React from "react";
import "./VideoPreview.scss";

const VideoPreview = ({ data }) => {
  return (
    <div className="video-preview">
      <video
        src={URL.createObjectURL(data)}
        controls
        autoPlay
        loop
        muted
        preload="auto"
        playsInline
        crossOrigin="anonymous"
      ></video>
    </div>
  );
};

export default React.memo(VideoPreview);
