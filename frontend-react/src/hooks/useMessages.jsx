import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

export const useMessages = () => {
  const { userID } = useParams();
  const { user } = useSelector((state) => state.authentication);
  const { connection } = useSelector((state) => state.app);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState();

  const handleMessages = useCallback((data) => {
    // console.log(data);
    setMessages(data);
    setLoading(false);
  }, []);

  // accept only messages that in sender and receiver to show in chat
  const updateMessages = useCallback(
    (data) => {
      if (data.sender === userID || data.sender === user?._id) {
        setMessages((prev) => [...prev, data.message]);
        // handle if user open chat so messages are seen
        connection.emit("seen-messages", { receiver: userID });
      }
      setLoading(false);
    },
    [userID, user?._id, connection]
  );
  // get messages between the current user and the receiver
  useEffect(() => {
    if (connection) {
      if (user && userID) {
        setLoading(true);
        connection.emit("chat-messages", {
          sender: user?._id,
          receiver: userID,
        });
        connection.on("chat-messages", handleMessages);
      }
    }
    return () => {
      connection.off("chat-messages");
      setMessages([]);
    };
  }, [user, userID, connection, handleMessages]);

  // append message to the message queue
  useEffect(() => {
    if (connection) {
      connection.on("new-message", updateMessages);
    }

    return () => {
      connection.off("new-message");
    };
  }, [connection, updateMessages]);

  // seen handlers for messages
  useEffect(() => {
    if (connection) {
      connection.emit("seen-messages", { receiver: userID });
      connection.on("seen-messages", (data) => {
        if (userID === data.sender) {
          handleMessages(data.messages);
        }
      });
      console.log("seen-messages");
    }
    return () => {
      if (connection) {
        connection.off("seen-messages");
      }
    };
  }, [connection, userID, handleMessages]);

  return { messages, loading };
};
