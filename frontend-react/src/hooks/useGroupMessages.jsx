import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

export const useGroupMessages = () => {
  const { connection, group } = useSelector((state) => state.app);
  const { groupID } = useParams();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleMessages = useCallback((data) => {
    setMessages(data.messages);
    setLoading(false);
  }, []);

  const pushNewMessage = useCallback(
    (data) => {
      console.log(data);
      if (data.groupID === groupID) {
        setMessages((prev) => [...prev, data.message]);
      }
    },
    [groupID]
  );
  // get messages
  useEffect(() => {
    if (connection) {
      connection.emit("get-group-messages", { groupID }, handleMessages);
    }
    return () => {
      if (connection) {
      }
    };
  }, [connection, groupID, handleMessages]);

  // get messages updates
  useEffect(() => {
    if (connection) {
      connection.on("new-message", pushNewMessage);
    }
    return () => {
      if (connection) {
        connection.off("new-message");
      }
    };
  }, [connection, pushNewMessage]);

  return { loading, messages };
};
