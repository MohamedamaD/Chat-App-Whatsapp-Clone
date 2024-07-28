import React from "react";
import moment from "moment";
import Avatar from "../Avatar/Avatar";
import "./UserCard.scss";
import { useParams } from "react-router-dom";

export const UserCard = ({ data, receiver }) => {
  const { userID } = useParams();
  const state = receiver._id === userID ? "active" : "inactive";
  const message =
    data?.lastMessage?.text ||
    (data?.lastMessage?.imageUrl && "Photo") ||
    (data?.lastMessage?.videoUrl && "Video");
  const time = moment(data?.lastMessage?.createdAt).format("hh:mm: a");
  return (
    <div className={`user-card pointer ${state}`}>
      <div className="card-container">
        <div className="fragment">
          <Avatar user={receiver} />
          <div className="text-container">
            <h3>{receiver?.name}</h3>
            <div className="message">
              {/* < /> */}

              <p>{message}</p>
            </div>
          </div>
        </div>
        <div className="time-container">
          <p>{time}</p>
        </div>
      </div>
    </div>
  );
};
