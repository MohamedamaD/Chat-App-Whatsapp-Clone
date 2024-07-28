import React from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "./UserCardSearchSkeleton.scss";

export const UserCardSearchSkeleton = ({ count }) => {
  return Array(count)
    .fill(0)
    .map((_, index) => (
      <div className="user-card-skeleton" key={index}>
        <SkeletonTheme baseColor="#b9d8bd" highlightColor="#fbfbfb8c">
          <div className="avatar">
            <Skeleton circle height={50} width={50} />
          </div>
          <div className="text-container">
            <Skeleton count={2} />
          </div>
        </SkeletonTheme>
      </div>
    ));
};
