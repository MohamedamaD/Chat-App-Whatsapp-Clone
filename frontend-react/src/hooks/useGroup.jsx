import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

export const useGroup = () => {
  const groupID = useParams();
  const connection = useSelector((state) => state.app.connection);
  const [group, setGroup] = useState(null);
  const handleGetGroup = useCallback((data) => {
    if (data.success) {
      setGroup(data.group);
    }
  }, []);

  useEffect(() => {
    if (connection) {
      connection.emit("get-group", groupID, handleGetGroup);
    }
    return () => {
      if (connection) {
        connection.off("get-group");
      }
    };
  }, [connection, groupID, handleGetGroup]);
  return group;
};
