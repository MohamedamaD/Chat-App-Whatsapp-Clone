import React from "react";
import { PiEmptyLight } from "react-icons/pi";
import "./Empty.scss";
export const Empty = ({ message = "" }) => {
  return (
    <div className="empty-container">
      <PiEmptyLight size={40} />
      <p>{message}</p>
    </div>
  );
};
