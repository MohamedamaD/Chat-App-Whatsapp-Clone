import MessageInput from "../../components/MessageInput/MessageInput";
import MessageList from "../../components/MessageList/MessageList";
import ChatHeader from "../../components/ChatHeader/ChatHeader";
import React, { useCallback, useState } from "react";
import { ChatPreview, ReceptionProfile } from "../";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import debounce from "lodash.debounce";
import toast from "react-hot-toast";
import "./Chat.scss";

export const Chat = () => {
  const { receiver } = useLocation().state;

  const user = useSelector((state) => state.authentication.user);
  const connection = useSelector((state) => state.app.connection);
  const { chatPreviewIsOpen } = useSelector((state) => state.chat);

  const [receptionProfile, openReceptionProfile] = useState(false);
  const [message, setMessage] = useState("");

  const sendHandler = (event) => {
    event.preventDefault();
    if (message) {
      if (connection) {
        const payload = {
          sender: user?._id,
          receiver: receiver?._id,
          text: message,
          imageUrl: "",
          videoUrl: "",
          owner: user?._id,
        };

        connection.emit("create-message", payload);
        setMessage("");
      }
    } else {
      toast.error("enter message first");
    }
  };

  const handleChange = (ev) => {
    setMessage(ev.target.value);
    handleTyping(); // invoke the callback to handle the typing delay
  };

  // debounce change event to notify listeners typing
  const handleTyping = useCallback(
    debounce(() => {
      if (connection) {
        connection.emit("typing", {
          sender: user?._id,
          receiver: receiver?._id,
        });
      }
    }, 300),
    [connection, user?._id, receiver?._id]
  );

  return (
    <div className="chat-window">
      <ChatHeader
        data={receiver}
        openHeaderInfo={() => openReceptionProfile(true)}
      />
      {receptionProfile && (
        <ReceptionProfile
          data={receiver}
          onClose={() => openReceptionProfile(false)}
        />
      )}
      {chatPreviewIsOpen && <ChatPreview data={receiver} user={user} />}

      {!chatPreviewIsOpen && <MessageList />}
      {!chatPreviewIsOpen && (
        <MessageInput
          message={message}
          handleChange={handleChange}
          sendHandler={sendHandler}
          setMessage={setMessage}
        />
      )}
    </div>
  );
};
