import React, { useState } from "react";
import { UserCardList, GroupCardList } from "../../containers";
import { Button } from "../../components";
import "./Conversations.scss";
export const Conversations = () => {
  const [activeList, setActiveList] = useState(listOptions.users);
  console.log(activeList);
  return (
    <div className="conversation-container">
      <div className="buttons-container">
        <Button
          onClick={() => setActiveList(listOptions.users)}
          className={activeList !== listOptions.users ? "disabled" : ""}
        >
          Conversations
        </Button>
        <Button
          onClick={() => setActiveList(listOptions.groups)}
          className={activeList !== listOptions.groups ? "disabled" : ""}
        >
          Groups
        </Button>
      </div>
      <div className="list-container">
        {activeList === listOptions.users && <UserCardList />}
        {activeList === listOptions.groups && <GroupCardList />}
      </div>
    </div>
  );
};

const listOptions = {
  users: "users",
  groups: "groups",
};
