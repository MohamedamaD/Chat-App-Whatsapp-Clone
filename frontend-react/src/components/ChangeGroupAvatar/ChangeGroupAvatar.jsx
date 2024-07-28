import React, { useRef, useState } from "react";
import { UploadFile } from "../../services/cloudinary";
import { useDispatch, useSelector } from "react-redux";
import { Loading } from "../../pages";
import "./ChangeGroupAvatar.scss";
import { BiCamera } from "react-icons/bi";
import toast from "react-hot-toast";
import { setGroup } from "../../store/slices/appSlice";
export const ChangeGroupAvatar = ({ groupID }) => {
  const [loading, setLoading] = useState(false);
  const uploadRef = useRef(null);
  const connection = useSelector((state) => state.app.connection);
  const dispatch = useDispatch();
  const changeHandler = async (event) => {
    const avatar = event.target.files[0];
    uploadAvatar(avatar);
    // onClick(event);
  };

  const uploadAvatar = async (avatar) => {
    setLoading(true);
    const responseData = await UploadFile(avatar);
    connection.emit(
      "update-group",
      {
        groupID,
        data: {
          avatar: responseData.url,
        },
      },
      (data) => {
        if (data.success) {
          toast.success("avatar updated successfully");
          dispatch(setGroup(data.group));
        }
      }
    );
    setLoading(false);
  };

  if (loading) return <Loading />;

  return (
    <div
      className="change-avatar flex-center"
      onClick={() => uploadRef.current.click()}
    >
      <BiCamera size={25} />
      <p>change group avatar</p>
      <input
        className="file-uploader"
        type="file"
        name="avatar"
        ref={uploadRef}
        onChange={changeHandler}
        accept="image/*"
      />
    </div>
  );
};
