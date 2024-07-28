import React from "react";
import "./Button.scss";
export const Button = ({ onClick, children, className = "", ...rest }) => {
  return (
    <button
      className={`custom-button ${className}`}
      onClick={onClick}
      {...rest}
    >
      {children}
    </button>
  );
};
