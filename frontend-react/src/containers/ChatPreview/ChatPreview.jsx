import { ImagePreview, VideoPreview } from "../../components";
import { clearPreview } from "../../store/slices/chatSlice";
import { UploadFile } from "../../services/cloudinary";
import { useDispatch, useSelector } from "react-redux";
import { Loading } from "../../pages/Loading/Loading";
import { BiSend, BiX } from "react-icons/bi";
import React, { useState } from "react";
import "./ChatPreview.scss";

export const ChatPreview = ({ data, user }) => {
  const { videoPreview, imagePreview } = useSelector((state) => state.chat);
  const connection = useSelector((state) => state.app.connection);

  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleSend = async (event) => {
    if (connection) {
      setLoading(true);

      const payload = {
        sender: user?._id,
        receiver: data?._id,
        text,
        imageUrl: "",
        videoUrl: "",
        owner: user?._id,
      };

      if (videoPreview) {
        const uploadData = await UploadFile(videoPreview);
        payload.videoUrl = uploadData.url;
      } else if (imagePreview) {
        const uploadData = await UploadFile(imagePreview);
        payload.imageUrl = uploadData.url;
      }

      connection.emit("create-message", payload);

      setLoading(false);
      dispatch(clearPreview());
    }
  };
  if (loading) return <Loading />;
  return (
    <div className="chat-preview">
      <div className="top-bar">
        <BiX
          size={25}
          className="pointer"
          onClick={() => dispatch(clearPreview())}
        />
      </div>

      <div className="preview">
        {videoPreview && <VideoPreview data={videoPreview} />}
        {imagePreview && <ImagePreview data={imagePreview} />}
      </div>

      <div className="caption">
        <input
          type="text"
          className="custom-input"
          placeholder="add a caption"
          value={text}
          onChange={(event) => setText(event.target.value)}
        />
      </div>

      <div className="send-button-fragment">
        <button className="send-button" onClick={handleSend}>
          <BiSend size={25} />
        </button>
      </div>
    </div>
  );
};
