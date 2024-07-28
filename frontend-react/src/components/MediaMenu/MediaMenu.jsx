import {
  clearPreview,
  setImagePreview,
  setVideoPreview,
} from "../../store/slices/chatSlice";
import { BiPhotoAlbum } from "react-icons/bi";
import { useDispatch } from "react-redux";
import React, { useRef } from "react";

import "./MediaMenu.scss";
export const MediaMenu = ({ onClose }) => {
  const uploadRef = useRef(null);
  const dispatch = useDispatch();

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file.type.includes("video")) {
      dispatch(setVideoPreview(file));
    } else if (file.type.includes("image")) {
      dispatch(setImagePreview(file));
    } else {
      dispatch(clearPreview());
    }
    onClose();
  };

  return (
    <>
      <div
        className="media-menu-overlay overlay pointer"
        onClick={onClose}
      ></div>
      <div className="media-menu">
        <ul className="rounded">
          <li
            className="upload-item-list"
            onClick={(event) => {
              uploadRef.current.click();
            }}
          >
            <p>
              <BiPhotoAlbum size={25} />
              <span>Photo & videos</span>
            </p>
            <input
              ref={uploadRef}
              type="file"
              accept="video/*,image/*"
              onChange={handleFileChange}
            />
          </li>
        </ul>
      </div>
    </>
  );
};
