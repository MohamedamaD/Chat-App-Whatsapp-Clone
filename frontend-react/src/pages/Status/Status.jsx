import {
  BiPalette,
  BiPhotoAlbum,
  BiPlus,
  BiSend,
  BiText,
  BiVideo,
  BiX,
} from "react-icons/bi";
import React, { useCallback, useEffect, useRef, useState } from "react";
import ArrowBack from "../../components/ArrowBack/ArrowBack";
import { UploadFile } from "../../services/cloudinary";
import { Empty } from "../../components/Empty/Empty";
import { Link, useNavigate } from "react-router-dom";
import Avatar from "../../components/Avatar/Avatar";
import { Loading } from "../Loading/Loading";
import { useSelector } from "react-redux";
import { formatDate } from "../../utils";
import toast from "react-hot-toast";
import "./Status.scss";

export const Status = () => {
  const [menuIsOpen, openMenu] = useState(false);
  const [statuses, setStatuses] = useState([]);
  const [contacts, setContacts] = useState([]);

  const connection = useSelector((state) => state.app.connection);
  const user = useSelector((state) => state.authentication.user);

  const handleStatusChange = useCallback((data) => {
    if (data.success) {
      setStatuses(data.statuses);
    }
  }, []);
  const handleContactsStatusChange = useCallback((data) => {
    if (data.success) {
      setContacts(data.contactsStatus);
    }
  }, []);
  useEffect(() => {
    if (connection) {
      connection.emit("my-status", { user: user?._id }, handleStatusChange);
    }
    return () => {
      if (connection) {
        connection.off("my-status");
      }
    };
  }, [connection, handleStatusChange, user?._id]);

  useEffect(() => {
    if (connection) {
      connection.emit(
        "contacts-status",
        { user: user?._id },
        handleContactsStatusChange
      );
    }
    return () => {
      if (connection) {
        connection.off("contacts-status");
      }
    };
  }, [connection, user?._id, handleContactsStatusChange]);

  useEffect(() => {
    if (connection) {
      connection.on("new-status", (data) => {
        setContacts((prev) => {
          const contactExists = prev.some(
            (contact) => contact.user._id === data.user._id
          );
          if (contactExists) {
            return prev.map((contact) =>
              contact.user._id === data.user._id ? { ...data } : contact
            );
          } else {
            return [data, ...prev];
          }
        });
      });
    }
    return () => {
      if (connection) {
        connection.off("new-status");
      }
    };
  }, [connection]);
  // console.log(statuses);
  return (
    <div id="status-page">
      <nav className="aside-nav">
        <div className="nav-container">
          <ArrowBack />
          <h1>Status</h1>
          <div className="icon flex-center" onClick={() => openMenu(true)}>
            <BiPlus size={25} />
          </div>
          {menuIsOpen && <StatusMenu onClose={() => openMenu(false)} />}
        </div>
      </nav>

      {statuses.length > 0 && (
        <Link to={`/user-status/${user?._id}`} className="status-card">
          <Avatar user={user} />
          <div className="text-container">
            <p>my status</p>
            <span>{formatDate(statuses[0]?.createdAt)}</span>
          </div>
        </Link>
      )}
      {statuses.length === 0 && <Empty message="add status to show" />}

      <section className="contacts-status">
        <p className="heading">contacts status</p>

        {contacts.map(({ user, createdAt }) => (
          <Link
            to={`/user-status/${user?._id}`}
            key={user?._id}
            className="status-card shadow"
          >
            <Avatar user={user} />
            <div className="text-container">
              <p>{user?.name}</p>
              <span>{formatDate(createdAt)}</span>
            </div>
          </Link>
        ))}
      </section>
    </div>
  );
};

const StatusMenu = ({ onClose, handleStatusChange }) => {
  const connection = useSelector((state) => state.app.connection);
  const user = useSelector((state) => state.authentication.user);
  const go = useNavigate();
  const photoInputRef = useRef(null);
  const videoInputRef = useRef(null);

  const [text, setText] = useState("");
  const [textMenu, setTextMenu] = useState(false);
  const [loading, setLoading] = useState(false);

  const [index, setIndex] = useState(0);
  const colors = [
    "#6e257e",
    "#5696ff",
    "#7e90a3",
    "#54c265",
    "#f0b330",
    "#41164b",
  ];

  const handleIndexChange = useCallback(
    (event) => setIndex((prev) => (prev + 1) % colors.length),
    [colors.length]
  );

  const handlePhotoClick = () => {
    photoInputRef.current.click();
  };

  const handleVideoClick = () => {
    videoInputRef.current.click();
  };

  const handlePhotoChange = async (event) => {
    const file = event.target.files[0];
    if (file && connection) {
      setLoading(true);
      const uploadData = await UploadFile(file);
      connection.emit(
        "create-status",
        {
          user: user._id,
          imageUrl: uploadData.url,
        },
        (data) => {
          if (data.success) {
            toast.success("Upload successfully");
            go(0);
          }
          console.log(data);
        }
      );
      setLoading(false);

      console.log("Photo selected:", file);
    }
    onClose();
  };

  const handleVideoChange = async (event) => {
    const file = event.target.files[0];
    if (file && connection) {
      setLoading(true);
      const uploadData = await UploadFile(file);
      connection.emit(
        "create-status",
        {
          user: user._id,
          videoUrl: uploadData.url,
        },
        (data) => {
          if (data.success) {
            toast.success("Upload successfully");
            go(0);
          }
          console.log(data);
        }
      );
      setLoading(false);

      console.log("Video selected:", file);
    }
    onClose();
  };

  const handleTextClick = async (event) => {
    if (connection) {
      setLoading(true);
      connection.emit(
        "create-status",
        {
          user: user._id,
          text,
          color: colors[index],
        },
        (data) => {
          if (data.success) {
            toast.success("Upload successfully");
            go(0);
          }
          console.log(data);
        }
      );
      setLoading(false);
    }
    setTextMenu(false);
    onClose();
  };

  console.log(colors[index], index);
  if (loading) return <Loading />;
  return (
    <div className="status-menu-fragment">
      <div className="overlay pointer" onClick={onClose}></div>
      <ul className="status-menu shadow rounded">
        <li className="hover" onClick={handlePhotoClick}>
          <BiPhotoAlbum size={25} />
          photo
        </li>
        <li className="hover" onClick={handleVideoClick}>
          <BiVideo size={25} />
          video
        </li>
        <li className="hover" onClick={() => setTextMenu(true)}>
          <BiText size={25} />
          text
        </li>
      </ul>
      <input
        type="file"
        ref={photoInputRef}
        style={{ display: "none" }}
        accept="image/*"
        onChange={handlePhotoChange}
      />
      <input
        type="file"
        ref={videoInputRef}
        style={{ display: "none" }}
        accept="video/*"
        onChange={handleVideoChange}
      />
      {textMenu && (
        <div className="text-menu" style={{ backgroundColor: colors[index] }}>
          <div className="top-bar">
            <BiX
              size={40}
              onClick={() => {
                onClose();
                setTextMenu(false);
              }}
            />

            <BiPalette size={25} onClick={handleIndexChange} />
          </div>
          <div className="input-field flex-center">
            <textarea
              name="text"
              placeholder="type a status"
              value={text}
              onChange={(event) => setText(event.target.value)}
              id="text"
            ></textarea>
          </div>
          <div className="send-container">
            <button
              className="pointer flex-center"
              disabled={!text}
              onClick={handleTextClick}
            >
              <BiSend size={25} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
