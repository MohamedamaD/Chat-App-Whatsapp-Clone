import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";

export const useJoinedGroups = () => {
  const connection = useSelector((state) => state.app.connection);
  const [joinedGroups, setJoinedGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  // memoize the groups
  const handleGetJoinedGroups = useCallback((data) => {
    if (data.success) {
      setJoinedGroups(data.groups);
    }
    setLoading(false);
  }, []);

  const updateJoinedGroups = useCallback((data) => {
    console.log(data);
    setJoinedGroups((prev) => [{ ...data, $new: true }, ...prev]);
  }, []);
  // when any admin update group this fn will be called
  const updateExistingGroup = useCallback((data) => {
    setJoinedGroups((prev) => {
      return prev.map((group) =>
        group._id === data._id ? { ...group, ...data } : group
      );
    });
  }, []);
  useEffect(() => {
    if (connection) {
      connection.emit("get-joined-groups", {}, handleGetJoinedGroups);
    }
    return () => {
      if (connection) {
        connection.off("get-joined-groups");
      }
    };
  }, [connection, handleGetJoinedGroups]);
  useEffect(() => {
    if (connection) {
      connection.on("join-group", updateJoinedGroups);
    }
    return () => {
      if (connection) {
        connection.off("join-group");
      }
    };
  }, [connection, updateJoinedGroups]);
  useEffect(() => {
    if (connection) {
      connection.on("group-updated", updateExistingGroup);
    }
    return () => {
      if (connection) {
        connection.off("group-updated");
      }
    };
  }, [connection, updateExistingGroup]);

  return { joinedGroups, loading };
};
