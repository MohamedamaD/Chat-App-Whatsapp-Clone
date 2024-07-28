import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";

// listen for user conversions and return conversions
export const useUserConversations = () => {
  const { user } = useSelector((state) => state.authentication);
  const { connection } = useSelector((state) => state.app);
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  // set user conversions => (contacts)
  const handleUserConversations = useCallback((data) => {
    setConversations(data);
    console.log("hi from user-conversations");

    setLoading(false);
  }, []);

  useEffect(() => {
    if (connection) {
      setLoading(true);
      connection.emit("user-conversations", { sender: user?._id });
      connection.on("user-conversations", handleUserConversations);

      connection.on("error", (error) => {
        console.error("Socket error:", error);
        setLoading(false);
      });
    }

    return () => {
      if (connection) {
        connection.off("user-conversations");
      }
    };
  }, [connection, user?._id, handleUserConversations]);

  // update user conversations
  const updateConversation = useCallback((data) => {
    console.log(data);
    if (data.isNew) {
      setConversations((prev) => [data.conversation, ...prev]);
    } else {
      setConversations((prev) => {
        const filter = prev.filter(
          (conversation) => conversation._id !== data.conversation._id
        );

        return [data.conversation, ...filter];
      });
    }
  }, []);
  useEffect(() => {
    if (connection) {
      connection.on("update-conversations", updateConversation);
    }
    return () => {
      if (connection) {
        connection.off("update-conversations");
      }
    };
  }, [connection, updateConversation]);

  // notification for online contact
  const updateUserContactStatus = useCallback((data, state) => {
    setConversations((prev) => {
      const newConversation = prev.map((conversation) => {
        if (conversation.sender._id === data.userId)
          conversation.sender.online = state;
        else if (conversation.receiver._id === data.userId)
          conversation.receiver.online = state;

        return conversation;
      });
      return newConversation;
    });
  }, []);
  useEffect(() => {
    if (connection) {
      connection.emit("user-online");

      connection.on("user-online", (data) =>
        updateUserContactStatus(data, true)
      );
      connection.on("user-offline", (data) =>
        updateUserContactStatus(data, false)
      );
    }
    return () => {
      if (connection) {
        connection.off("user-online");
      }
    };
  }, [connection, updateUserContactStatus]);

  return { loading, conversations };
};
