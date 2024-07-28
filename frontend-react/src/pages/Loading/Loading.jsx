import React from "react";
import "./Loading.scss";
import { BiLoader } from "react-icons/bi";

export const Loading = () => {
  return (
    <div id="loading">
      <BiLoader size={40} />
    </div>
  );
};
