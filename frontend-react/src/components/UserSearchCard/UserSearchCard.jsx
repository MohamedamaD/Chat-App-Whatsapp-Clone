import React from "react";
import Avatar from "../Avatar/Avatar";
import "./UserSearchCard.scss";

export const UserSearchCard = ({ user }) => {
  return (
    <div className="user-card">
      <div className="card-container">
        <div className="fragment">
          <Avatar user={user} />
          <div className="text-container">
            <h3>{user?.name}</h3>
            <p>{user?.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
