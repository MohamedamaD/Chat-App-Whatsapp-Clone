import { useUserConversations } from "../../hooks/useUserConversations";
import { Empty, UserCard, UserCardSearchSkeleton } from "../../components";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import React, { useMemo } from "react";

import "./UserCardList.scss";
export const UserCardList = () => {
  const { conversations, loading } = useUserConversations();
  const { user } = useSelector((state) => state.authentication);

  const conversationsWithReceivers = useMemo(() => {
    return conversations.map((conversation) => ({
      conversation,
      receiver:
        user?._id === conversation?.sender?._id
          ? conversation?.receiver
          : conversation?.sender,
    }));
  }, [conversations, user?._id]);

  if (loading) return <UserCardSearchSkeleton count={4} />;
  return (
    <div className="user-card-list">
      <div className="user-card-list-container">
        {conversationsWithReceivers.map((item) => {
          return (
            <Link
              key={item.conversation?._id}
              state={{ isSearch: false, receiver: item.receiver }}
              to={`/conversation/${item.receiver?._id}`}
            >
              <UserCard data={item.conversation} receiver={item.receiver} />
            </Link>
          );
        })}
      </div>

      {conversations.length === 0 && (<Empty message="No users please search"/>)}
    </div>
  );
};
