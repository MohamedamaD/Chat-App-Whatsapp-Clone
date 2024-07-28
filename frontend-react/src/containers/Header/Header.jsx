import React, { useState } from "react";
import { Avatar } from "../../components";
import { useNavigate } from "react-router-dom";
import { useSetAside } from "../../hooks/useSetAside";
import { useDispatch, useSelector } from "react-redux";
import { BiBullseye, BiDotsVerticalRounded, BiLogOut } from "react-icons/bi";
import { signOut } from "../../store/slices/authenticationSlice";

import "./Header.scss";
import { asideOptions } from "../../store/slices/appSlice";

const Header = () => {
  const { user } = useSelector((state) => state.authentication);
  const [headerPanelIsOpen, openHeaderPanel] = useState(false);
  const dispatch = useDispatch();
  const go = useNavigate();

  const handleCreateGroup = (event) => {
    setAsideOption("createGroup");
  };

  const logoutHandler = (event) => {
    dispatch(signOut());
    go("auth/sign-in");
  };

  const setAsideOption = useSetAside();
  // console.log(`message from header`);
  return (
    <header id="header">
      <div className="header-container">
        <div
          className="avatar-fragment"
          onClick={() => setAsideOption("profile")}
        >
          <Avatar user={user} />
        </div>
        {/* header menu */}
        {headerPanelIsOpen && (
          <div className="header-panel">
            <div
              className="header-panel-overlay overlay pointer"
              onClick={() => openHeaderPanel(false)}
            ></div>
            <ul className="shadow rounded">
              <li className="pointer" onClick={handleCreateGroup}>
                <span>new group</span>
              </li>
            </ul>
          </div>
        )}
        <div className="icons">
          <div className="icon" onClick={() => setAsideOption(asideOptions.status)}>
            <BiBullseye size={25} />
          </div>
          <div className="icon">
            <BiDotsVerticalRounded
              size={25}
              onClick={() => openHeaderPanel(true)}
            />
          </div>

          <div className="icon" onClick={logoutHandler}>
            <BiLogOut size={25} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default React.memo(Header);
