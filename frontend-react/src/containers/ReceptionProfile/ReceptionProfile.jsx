import { Avatar } from "../../components";
import { BiX } from "react-icons/bi";
import React from "react";

import "./ReceptionProfile.scss";
export const ReceptionProfile = ({ onClose, data }) => {
  return (
    <div className="reception-profile">
      <div
        className="reception-profile-overlay overlay pointer"
        onClick={onClose}
      ></div>
      <div className="reception-container shadow rounded">
        <div className="contact">
          <BiX size={25} className="pointer" onClick={onClose} />
          <p>contact info</p>
        </div>
        <div className="avatar-fragment white-container">
          <Avatar user={data} displayName={true} className="x-large" />
          <p className="email">{data?.email}</p>
          {data?.online ? (
            <span className="online">online</span>
          ) : (
            <span className="offline">offline</span>
          )}
        </div>
        <div className="white-container">
          <p className="secondary-color title">about</p>
          <p>{data?.about || "hello world!"}</p>
        </div>
      </div>
    </div>
  );
};
