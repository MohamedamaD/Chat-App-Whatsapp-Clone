import React, { useRef } from "react";
import MessageSkeleton from "../../components/MessageSkeleton/MessageSkeleton";
import { Avatar, Message } from "../../components";
import { useSelector } from "react-redux";
import { useMessages } from "../../hooks/useMessages";
import { useScrollDown } from "../../hooks/useScrollDown";
import "./MessageList.scss";
import { useGroupMessages } from "../../hooks/useGroupMessages";
const MessageList = ({ isGroup = false }) => {
  const messagesRef = useRef(null);
  const { user } = useSelector((state) => state.authentication);

  const FN = isGroup ? useGroupMessages : useMessages;
  const { loading, messages } = FN(); // get messages

  useScrollDown(messages, messagesRef);

  return (
    <main ref={messagesRef} className="messages-list">
      {loading ? (
        <MessageSkeleton count={1} />
      ) : (
        messages.map((msg, i) =>
          isGroup ? (
            <div
              className={`message-fragment ${
                msg?.owner === user?._id || msg?.owner._id === user?._id
                  ? "active"
                  : ""
              }`}
            >
              <div className="user-info">
                <Avatar
                  user={msg?.owner}
                  displayName={true}
                  className="x-small"
                />
              </div>
              <Message key={i} data={msg} owner={user?._id} />
            </div>
          ) : (
            <Message key={i} data={msg} owner={user?._id} />
          )
        )
      )}
    </main>
  );
};

export default React.memo(MessageList);
