import { Hero, Profile, UsersAside } from "../../containers";
import { asideOptions } from "../../store/slices/appSlice";
import { Outlet, useParams } from "react-router-dom";
import { CreateGroup, Status } from "../../pages";
import { useSocket } from "../../hooks/useSocket";
import { useSelector } from "react-redux";
import React from "react";

import "./HomeOutlet.scss";
export const HomeOutlet = () => {
  // handle later mobile screen => targetUser
  const { userID, groupID } = useParams();
  const { aside } = useSelector((state) => state.app);

  useSocket();
  console.log("home outlet rendered");

  return (
    <div id="home-outlet">
      <aside className={`main ${userID || groupID ? "hidden" : ""}`}>
        {aside === asideOptions.users && <UsersAside />}
        {aside === asideOptions.profile && <Profile />}
        {aside === asideOptions.createGroup && <CreateGroup />}
        {aside === asideOptions.status && <Status />}
      </aside>
      <section className={`content ${userID || groupID ? "active" : ""}`}>
        <Hero />
        <Outlet />
      </section>
    </div>
  );
};
