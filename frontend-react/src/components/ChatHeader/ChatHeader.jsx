import { BiArrowBack, BiDotsVerticalRounded } from "react-icons/bi";
import { Link, useParams } from "react-router-dom";
import Avatar from "../../components/Avatar/Avatar";
import React, { useEffect, useRef, useState } from "react";
import "./ChatHeader.scss";
import { useSelector } from "react-redux";

const ChatHeader = ({ data, openHeaderInfo, isGroup = false }) => {
  const connection = useSelector((state) => state.app.connection);
  const [isTyping, setTyping] = useState(false);
  const typingRef = useRef(null);
  const { userID } = useParams();

  const user = isGroup
    ? { avatar: data?.avatar, name: data?.subject, online: false }
    : data;

  // set and reset typing delays
  useEffect(() => {
    if (connection && userID) {
      connection.on("typing", ({ sender }) => {
        if (sender === userID) {
          setTyping(true);
          clearTimeout(typingRef.current);
          typingRef.current = setTimeout(() => {
            setTyping(false);
          }, 3000);
        }
      });

      connection.on("stop-typing", ({ sender }) => {
        if (sender === userID) {
          setTyping(false);
          clearTimeout(typingRef.current);
        }
      });
    }

    return () => {
      if (connection && userID) {
        connection.off("typing");
        connection.off("stop-typing");
      }
    };
  }, [connection, userID]);

  return (
    <header className="chat-header">
      <Link to={"/"} replace={true} className="back-icon-mobile-screen pointer">
        <BiArrowBack size={25} />
      </Link>
      <div className="reception-info pointer" onClick={openHeaderInfo}>
        <div className="image-container">
          <Avatar user={user} />
        </div>
        <div className="text-container">
          <p>{user?.name}</p>
          {isTyping && <span className="typing">typing ...</span>}
        </div>
      </div>
      <div className="icon-container">
        <BiDotsVerticalRounded size={25} />
      </div>
    </header>
  );
};

export default React.memo(ChatHeader);
