import React from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "./MessageSkeleton.scss";

const MessageSkeleton = ({ count }) => {
  return Array(count)
    .fill(0)
    .map((_, index) => (
      <div className="message-skeleton" key={index}>
        <SkeletonTheme baseColor="#b9d8bd" highlightColor="#fbfbfb8c">
          <div className="message rounded">
            <div className="image-container">
              <Skeleton height={100} width={100} />
            </div>
            <div className="video-container">
              <Skeleton height={200} />
            </div>
            <p className="text">
              <Skeleton count={3} />
            </p>
            <span className="time">
              <Skeleton width={50} />
            </span>
          </div>
        </SkeletonTheme>
      </div>
    ));
};

export default React.memo(MessageSkeleton);
