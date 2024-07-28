import { UploadFile } from "../../services/cloudinary";
import {
  editUserDetails,
  setLoading,
} from "../../store/slices/authenticationSlice";
import { useDispatch, useSelector } from "react-redux";
import React, { useRef } from "react";
import "./AvatarActions.scss";
import { Loading } from "../../pages/Loading/Loading";
import { images } from "../../constants";

export const AvatarActions = ({ onClick }) => {
  const uploadRef = useRef(null);
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.authentication);

  const changeHandler = async (event) => {
    event.stopPropagation();
    const avatar = event.target.files[0];
    uploadAvatar(avatar);
    onClick(event);
  };
  // put the default avatar in file and update the avatar
  const removePhoto = async (event) => {
    const response = await fetch(images.DEFAULT_AVATAR);
    const blob = await response.blob();
    const avatar = new File([blob], "avatar.jpg", { type: "image/jpeg" });

    uploadAvatar(avatar);
    onClick(event);
  };

  const uploadPhoto = (event) => {
    uploadRef.current.click();
  };

  const uploadAvatar = async (avatar) => {
    dispatch(setLoading(true));
    const responseData = await UploadFile(avatar);
    dispatch(setLoading(false));

    dispatch(
      editUserDetails({
        data: {
          avatar: responseData.url,
        },
      })
    );
  };

  if (loading) return <Loading />;

  return (
    <div id="avatar-actions" className="rounded">
      <div className="actions-container">
        <button onClick={uploadPhoto}>
          <span>upload photo</span>
          <input
            className="file-uploader"
            type="file"
            name="avatar"
            ref={uploadRef}
            onChange={changeHandler}
            accept="image/*"
          />
        </button>
        <button onClick={removePhoto}>
          <span>remove photo</span>
        </button>
      </div>
    </div>
  );
};
