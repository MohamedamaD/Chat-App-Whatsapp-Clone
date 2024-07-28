import { UserCardSearchSkeleton, UserSearchCard } from "../../components";
import { useDebounce } from "../../hooks/useDebounce";
import React, { useEffect, useState } from "react";
import { TbMoodEmpty } from "react-icons/tb";
import { Link } from "react-router-dom";
import api from "../../services/api";

import "./SearchResult.scss";
export const SearchResult = ({ searchQuery }) => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const debounce = useDebounce(searchQuery, 300);

  useEffect(() => {
    const userSearch = () => {
      try {
        // reset status
        setLoading(true);
        setUsers([]);

        api.get(`/api/v1/users/user/search?q=${debounce}`).then((payload) => {
          setUsers(payload.data?.data);
          setLoading(false);
        });
      } catch (error) {
        console.log(error);
      }
    };
    userSearch();
    return () => {};
  }, [debounce]);

  if (loading) return <UserCardSearchSkeleton count={4} />;
  return (
    <div id="search-result">
      {users.map((user, index) => (
        <Link
          to={`/conversation/${user?._id}`}
          state={{ isSearch: true, receiver: user }}
          className="user-search-card-fragment"
          key={index}
        >
          <UserSearchCard user={user} />
        </Link>
      ))}
      {users.length === 0 && (
        <div className="empty-section">
          <TbMoodEmpty size={50} />
          <p>there is no users</p>
        </div>
      )}
    </div>
  );
};
