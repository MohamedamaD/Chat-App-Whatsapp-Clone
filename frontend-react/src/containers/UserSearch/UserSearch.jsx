import React, { useRef, useState, useCallback } from "react";
import { BiArrowBack, BiSearch } from "react-icons/bi";

import "./UserSearch.scss";
const UserSearch = ({ searchTerm, setSearchTerm }) => {
  const [isFocus, setFocus] = useState(false);
  const input = useRef(null);

  // console.log("hello from user search");

  const handleSearch = useCallback(
    (event) => {
      setSearchTerm(event.target.value);
    },
    [setSearchTerm]
  );

  return (
    <div className="user-search">
      <div className="search-container">
        {!isFocus && (
          <div className="icon" onClick={() => input.current.focus()}>
            <BiSearch size={25} />
          </div>
        )}
        {isFocus && (
          <div
            className="icon back"
            onClick={(ev) => {
              ev.stopPropagation();
              setSearchTerm("");
              setFocus(false);
            }}
          >
            <BiArrowBack size={25} />
          </div>
        )}

        <input
          type="text"
          name="search"
          id="search"
          placeholder="Search"
          className="custom-input"
          ref={input}
          value={searchTerm}
          onFocus={() => setFocus(true)}
          onChange={handleSearch}
        />
      </div>
    </div>
  );
};

export default React.memo(UserSearch);
