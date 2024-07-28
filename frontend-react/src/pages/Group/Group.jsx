import React, { useState } from "react";
import MessageList from "../../components/MessageList/MessageList";
import { ChatHeader, MessageInput } from "../../components";
import { setGroup } from "../../store/slices/appSlice";
import { useDispatch, useSelector } from "react-redux";
import { useGroup } from "../../hooks/useGroup";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import "./Group.scss";

export const Group = () => {
  const dispatch = useDispatch();
  const go = useNavigate();
  const group = useGroup();
  const [message, setMessage] = useState("");
  const connection = useSelector((state) => state.app.connection);
  const user = useSelector((state) => state.authentication.user);

  const handleChange = (ev) => {
    setMessage(ev.target.value);
  };

  const sendHandler = (event) => {
    event.preventDefault();
    if (message) {
      if (connection) {
        connection.emit("send-group-message", {
          text: message,
          imageUrl: "",
          videoUrl: "",
          owner: user?._id,
          groupID: group._id,
        });
        setMessage("");
      }
    } else {
      toast.error("enter message first");
    }
  };

  return (
    <div className="group-window">
      <ChatHeader
        data={group}
        isGroup={true}
        openHeaderInfo={() => {
          dispatch(setGroup(group));
          go(`/groups/${group?._id}/info`);
        }}
      />

      <MessageList isGroup={true} />
      <MessageInput
        message={message}
        handleChange={handleChange}
        sendHandler={sendHandler}
      />
    </div>
  );
};
