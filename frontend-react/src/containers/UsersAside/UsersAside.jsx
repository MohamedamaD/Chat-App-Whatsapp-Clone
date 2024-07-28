import React, { useState } from "react";
import Header from "../Header/Header";
import UserSearch from "../UserSearch/UserSearch";
import { SearchResult, Conversations } from "../../pages";
import './UsersAside.scss'
export const UsersAside = () => {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="users-container">
      <Header />
      <div className="main-container">
        <div className="search-fragment">
          <UserSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </div>
        {searchTerm ? (
          <SearchResult searchQuery={searchTerm} />
        ) : (
          <Conversations />
        )}
      </div>
    </div>
  );
};
