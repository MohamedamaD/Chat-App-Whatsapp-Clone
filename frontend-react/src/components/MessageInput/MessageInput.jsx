import { BiPlus, BiSend } from "react-icons/bi";
import React, { useState } from "react";
import { MediaMenu } from "../../components/MediaMenu/MediaMenu";
import "./MessageInput.scss";
const MessageInput = ({ message, sendHandler, handleChange }) => {
  const [mediaIsOpen, OpenMedia] = useState(false);

  return (
    <footer className="chat-footer">
      <div className="icon-container">
        <BiPlus size={25} onClick={() => OpenMedia(true)} />
      </div>
      {mediaIsOpen && <MediaMenu onClose={() => OpenMedia(false)} />}
      <form>
        <div className="input-field">
          <input
            type="text"
            name="message"
            id="message"
            required={true}
            className="custom-input"
            placeholder="Type a message"
            value={message}
            onChange={handleChange}
          />
        </div>
        <button className="icon-container send-icon" onClick={sendHandler}>
          <BiSend size={25} />
        </button>
      </form>
    </footer>
  );
};

export default MessageInput;
