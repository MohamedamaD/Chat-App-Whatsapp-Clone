import React from "react";
import { Outlet } from "react-router-dom";
import { images } from "../../constants";
import "./AuthOutlet.scss";
export const AuthOutlet = () => {
  return (
    <div id="auth">
      <nav>
        <div className="image-container">
          <img src={images.LARGE_LOGO} alt="app-logo" />
        </div>
      </nav>
      <section className="main-section">
        <Outlet />
      </section>
    </div>
  );
};
