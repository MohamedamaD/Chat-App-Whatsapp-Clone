import { editUserDetails } from "../../store/slices/authenticationSlice";
import { BiCamera, BiCheck, BiSolidPencil } from "react-icons/bi";
import ArrowBack from "../../components/ArrowBack/ArrowBack";
import { Avatar, AvatarActions } from "../../components";
import { useDispatch, useSelector } from "react-redux";
import React, { useCallback, useState } from "react";
import { Loading } from "../../pages";
import "./Profile.scss";

export const Profile = () => {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.authentication);
  const [avatarIsOpen, openAvatarActions] = useState(false);
  const [readOnly, setReadOnly] = useState({
    name: true,
    about: true,
  });
  const [editUser, setUser] = useState({
    avatar: user?.avatar || "",
    name: user?.name || "",
    about: user?.about || "",
  });

  const changeHandler = useCallback((event) => {
    const { name, value } = event.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  }, []);

  const editHandler = (name, value) => {
    dispatch(
      editUserDetails({
        data: {
          [name]: value,
        },
      })
    );
    setReadOnly((prev) => ({ ...prev, [name]: true }));
  };

  const closeAvatarActions = (event) => {
    event.stopPropagation();
    openAvatarActions(false);
  };

  if (loading) return <Loading />;
  return (
    <div id="edit-profile">
      <nav className="aside-nav">
        <div className="nav-container">
          <ArrowBack />
          <h1>profile</h1>
        </div>
      </nav>
      <section>
        <div
          className="avatar-fragment"
          onClick={() => openAvatarActions(true)}
        >
          {avatarIsOpen && (
            <>
              <div className="overlay-close" onClick={closeAvatarActions}></div>

              <AvatarActions onClick={closeAvatarActions} />
            </>
          )}
          <Avatar className="x-large" user={user} />
          <div className="change-container">
            <BiCamera size={25} />
            <p>
              change <br /> profile photo
            </p>
          </div>
        </div>
        <div className="white-container">
          <p>your name</p>
          <div className="input-field">
            <input
              type="text"
              name="name"
              placeholder="please enter your name"
              className={`${!readOnly.name ? "custom-input" : ""}`}
              value={editUser.name}
              onChange={changeHandler}
              readOnly={readOnly.name}
            />

            {readOnly.name && (
              <BiSolidPencil
                size={25}
                onClick={() =>
                  setReadOnly((prev) => ({ ...prev, name: false }))
                }
              />
            )}

            {!readOnly.name && (
              <BiCheck
                size={25}
                onClick={() => editHandler("name", editUser.name)}
              />
            )}
          </div>
        </div>
        <p className="message">
          This is not your username or PIN. This name will be visible to your
          WhatsApp contacts.
        </p>
        <div className="white-container">
          <p>about</p>
          <div className="input-field">
            <input
              type="text"
              name="about"
              placeholder="please enter your about"
              className={`${!readOnly.about ? "custom-input" : ""}`}
              value={editUser.about}
              onChange={changeHandler}
              readOnly={readOnly.about}
            />
            {readOnly.about && (
              <BiSolidPencil
                size={25}
                onClick={() =>
                  setReadOnly((prev) => ({ ...prev, about: false }))
                }
              />
            )}
            {!readOnly.about && (
              <BiCheck
                size={25}
                onClick={() => editHandler("about", editUser.about)}
              />
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
