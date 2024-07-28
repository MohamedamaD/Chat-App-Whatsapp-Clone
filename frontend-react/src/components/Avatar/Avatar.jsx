import React from "react";
import "./Avatar.scss";

const Avatar = ({ className = "", displayName = false, user }) => {
  const { avatar, name, online } = user || {};
  // console.log("avatar render");
  return (
    <div className={`user-avatar`}>
      <div className={`avatar-container shadow ${className}`}>
        {avatar && <img src={avatar} loading="lazy" alt="avatar" />}
        {online && <span className="active-user"></span>}

        {!avatar && (
          <strong>
            {name?.split(" ")?.map((item) => item[0].toUpperCase())}
          </strong>
        )}
      </div>
      {displayName && <p className="name">{name}</p>}
    </div>
  );
};

export default Avatar;
