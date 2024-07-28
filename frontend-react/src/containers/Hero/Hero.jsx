import React from "react";
import { images } from "../../constants";
import "./Hero.scss";
export const Hero = () => {
  return (
    <div className="hero-container">
      <div className="logo">
        <img src={images.LARGE_LOGO} alt="LARGE_LOGO" />
      </div>
      <h1>
        welcome to <span>WhatsApp</span> clone
      </h1>
      <p>feel free and select user to say hi</p>
    </div>
  );
};
