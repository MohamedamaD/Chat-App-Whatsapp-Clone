import { BiCheck } from "react-icons/bi";
import moment from "moment";
import React, { useMemo } from "react";
import "./Message.scss";
export const Message = ({ data, owner }) => {
  const isCurrentUser = useMemo(
    () => data?.owner === owner || data?.owner._id === owner,
    [data?.owner, owner]
  );
  return (
    <div className={`chat-message rounded ${isCurrentUser ? "active" : ""}`}>
      {data?.imageUrl && (
        <div className="image-container">
          <img src={data?.imageUrl} alt="message-image" />
        </div>
      )}
      {data?.videoUrl && (
        <div className="video-container">
          <video
            src={data?.videoUrl}
            onClick={(ev) => ev.currentTarget.requestFullscreen()}
            controls
            autoPlay
            loop
            muted
            preload="auto"
            playsInline
            crossOrigin="anonymous"
          />
        </div>
      )}
      <p className="text">{data?.text}</p>
      <div className="fragment">
        <span className="time">{moment(data.createdAt).format("hh:mm a")}</span>
        {data?.owner === owner && (
          <span className={`status-fragment ${data?.seen ? "active" : ""}`}>
            <BiCheck size={20} />
            {data?.seen && <BiCheck size={20} />}
          </span>
        )}
      </div>
    </div>
  );
};
