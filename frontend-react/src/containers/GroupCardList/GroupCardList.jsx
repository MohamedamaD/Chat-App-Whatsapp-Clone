import React from "react";
import { Empty, UserCardSearchSkeleton } from "../../components";
import { useJoinedGroups } from "../../hooks/useJoinedGroups";
import Avatar from "../../components/Avatar/Avatar";
import { Link, useParams } from "react-router-dom";
import "./GroupCardList.scss";
export const GroupCardList = () => {
  const { joinedGroups, loading } = useJoinedGroups();
  const { groupID } = useParams();
  if (loading) return <UserCardSearchSkeleton count={4} />;

  return (
    <div className="group-card-list">
      {joinedGroups.map((group) => (
        <GroupCard key={group._id} group={group} groupID={groupID} />
      ))}

      {joinedGroups.length === 0 && (
        <Empty message="you are no joined any group" />
      )}
    </div>
  );
};

const GroupCard = ({ group, groupID }) => {
  const state = groupID === group._id ? "active" : "";
  return (
    <Link
      className={`card ${state} ${group.$new ? "is-new" : ""}`}
      to={`/groups/${group._id}`}
    >
      <Avatar user={group} />
      <div className="text-container">
        <p>{group.subject}</p>
        {group.$new && <p className="is-new">joined new group</p>}
      </div>
    </Link>
  );
};
