import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  BiArrowBack,
  BiCamera,
  BiCheck,
  BiSolidChevronRight,
  BiUserCircle,
  BiX,
} from "react-icons/bi";

import { asideOptions, setAside } from "../../store/slices/appSlice";
import ArrowBack from "../../components/ArrowBack/ArrowBack";
import { useDispatch, useSelector } from "react-redux";
import { UploadFile } from "../../services/cloudinary";
import { useNavigate } from "react-router-dom";
import { Loading } from "../Loading/Loading";
import { Avatar } from "../../components";
import api from "../../services/api";
import toast from "react-hot-toast";
import "./CreateGroup.scss";

export const CreateGroup = () => {
  // global state for manege panels / connection / loading
  const [stage, setStage] = useState("add-group-member");
  const { connection } = useSelector((state) => state.app);
  const [loading, setLoading] = useState(false);
  const go = useNavigate();
  const dispatch = useDispatch();
  // search & search handles
  const [searchTerm, setSearchTerm] = useState("");
  const handleSearch = useCallback(
    (event) => setSearchTerm(event.target.value),
    []
  );
  // contacts & contacts handles
  const [contacts, setContacts] = useState([]);
  const searchList = contacts.filter((contact) =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const fetchContacts = useCallback(async () => {
    try {
      console.log("fetching");

      const response = await api.get("api/v1/conversations/contacts");
      if (response.status === 200) {
        setContacts(response.data.data.contacts);
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  // selected & selected handles
  const [selectedContacts, setSelectedContacts] = useState([]);
  const handleSelectedContacts = useCallback(
    (contact) =>
      setSelectedContacts((prev) => {
        if (!prev.includes(contact)) {
          return [...prev, contact];
        } else return prev;
      }),
    []
  );
  const handleUnSelectedContacts = useCallback((contact) => {
    setSelectedContacts((prev) => {
      const filter = prev.filter((c) => c._id !== contact._id);
      return [...filter];
    });
  }, []);

  // group information
  const uploadRef = useRef(null);
  const [subject, setSubject] = useState("");
  const [avatar, setAvatar] = useState("");

  const avatarImage = useMemo(
    () => (avatar ? URL.createObjectURL(avatar) : ""),
    [avatar]
  );
  const handleFileChange = (event) => {
    uploadRef.current.click();
  };
  // create group handle
  const handleCreate = async (event) => {
    if (!avatar) {
      toast.error("Please select an group avatar");
      return;
    }
    if (!subject) {
      toast.error("Please enter a subject");
      return;
    }
    setLoading(true);
    const uploadData = await UploadFile(avatar);
    const members = selectedContacts.map((contact) => ({ user: contact._id }));
    const payload = {
      avatar: uploadData.url,
      subject,
      members,
    };
    connection.emit("create-group", payload, (data) => {
      if (data.success) {
        toast.success("Group created successfully");
        go(`/groups/${data.group._id}`);
        dispatch(setAside(asideOptions.users));
      } else {
        toast.error("Group creation failed why? مش عارف الحقيقه 😂😂");
      }
    });
    setLoading(false);
  };

  useEffect(() => {
    fetchContacts();
    return () => {};
  }, [fetchContacts]);

  if (loading) return <Loading />;
  return (
    <div id="create-group">
      <div className="create-group-container">
        <div className="heading">
          {stage === "add-group-member" ? (
            <div className="heading-container">
              <ArrowBack />
              <h1>add group members</h1>
            </div>
          ) : (
            <div
              className="heading-container"
              onClick={() => setStage("add-group-member")}
            >
              <BiArrowBack size={25} className="pointer" />
              <h1>New Group</h1>
            </div>
          )}
        </div>
        {stage === "add-group-member" ? (
          <main className="add-group-member-main">
            {selectedContacts.length !== 0 && (
              <section className="selected-contacts">
                {selectedContacts.map((selectedContact, index) => (
                  <div className="selected-contacts-container" key={index}>
                    <Avatar user={selectedContact} className="x-small" />
                    <p>{selectedContact?.name}</p>
                    <div className="unselect-icon">
                      <BiX
                        size={20}
                        className="pointer"
                        onClick={() =>
                          handleUnSelectedContacts(selectedContact)
                        }
                      />
                    </div>
                  </div>
                ))}
              </section>
            )}

            <section className="search">
              <input
                type="text"
                className="custom-input"
                name="search-contact"
                placeholder="search contact name"
                value={searchTerm}
                onChange={handleSearch}
              />
            </section>
            <section className="contacts">
              {searchList.length === 0 && (
                <div className="empty-contact">
                  <p>no contacts found</p>
                </div>
              )}
              {searchList.map((contact, index) => (
                <div
                  className="contact"
                  key={contact?._id || index}
                  onClick={() => handleSelectedContacts(contact)}
                >
                  <Avatar user={contact} />
                  <div className="text-container">
                    <h5>{contact?.name}</h5>
                    <p>{contact?.about}</p>
                  </div>
                </div>
              ))}
            </section>

            {selectedContacts.length !== 0 && (
              <button
                className="new-group rounded-button"
                onClick={() => setStage("new-group")}
              >
                <BiSolidChevronRight size={25} />
              </button>
            )}
          </main>
        ) : (
          <main className="new-group-main">
            <section className="group-avatar shadow" onClick={handleFileChange}>
              <div className="group-avatar-container pointer">
                {avatar && (
                  <div className="avatar-show">
                    <img src={avatarImage} alt="group-avatar" />
                  </div>
                )}
                <div className="floating-overlay">
                  <BiUserCircle size={200} />
                </div>
                <input
                  className="file-uploader"
                  type="file"
                  name="avatar"
                  ref={uploadRef}
                  accept="image/*"
                  onChange={(event) => setAvatar(event.target.files[0])}
                />
                <div className="group-avatar-fragment">
                  <BiCamera size={25} />
                  <p>add group icon</p>
                </div>
              </div>
            </section>
            <section className="group-subject shadow">
              <input
                type="text"
                className="custom-input"
                name="group-subject"
                placeholder="group subject"
                value={subject}
                onChange={(event) => setSubject(event.target.value)}
              />
            </section>
            <button
              className="create-group rounded-button shadow"
              onClick={handleCreate}
            >
              <BiCheck size={25} />
            </button>
          </main>
        )}
      </div>
    </div>
  );
};
