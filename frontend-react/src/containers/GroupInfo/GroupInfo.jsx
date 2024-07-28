import React, {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import "./GroupInfo.scss";
import { BiExit, BiRecycle, BiSend, BiUserPlus, BiX } from "react-icons/bi";
import { setGroup } from "../../store/slices/appSlice";
import { useDispatch, useSelector } from "react-redux";
import { ChangeGroupAvatar } from "../../components/ChangeGroupAvatar/ChangeGroupAvatar";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import Avatar from "../../components/Avatar/Avatar";
import api from "../../services/api";
export const GroupInfo = () => {
  const [member, setMember] = useState(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });

  const { group, connection } = useSelector((state) => state.app);
  const { user } = useSelector((state) => state.authentication);
  const [addMemberIsOpen, openAddMember] = useState(false);
  const go = useNavigate();
  const count = group?.members?.length;
  const isAdmin = useMemo(() => {
    let isAdmin = false;
    group.members.forEach((member) => {
      if (member?.user?._id === user?._id && member?.role === "admin") {
        isAdmin = true;
        return;
      }
    });
    return isAdmin;
  }, [group?.members, user?._id]);

  const handleGroupExit = (event) => {
    connection.emit(
      "exit-group",
      { userID: user._id, groupID: group._id },
      (data) => {
        if (data.success) {
          toast.success("Group exited successfully");
          go(0);
        }
      }
    );
  };
  const handleGroupDelete = (event) => {
    connection.emit("delete-group", { groupID: group._id }, (data) => {
      if (data.success) {
        toast.success("Group deleted successfully");
        go(0);
      }
      console.log(data);
    });
  };

  return (
    <div className="group-info">
      <header>
        <div className="exit-icon flex-center pointer" onClick={() => go(-1)}>
          <BiX size={25} />
        </div>
        <p>group info</p>
      </header>
      <section className="information shadow">
        <div className="custom-avatar pointer">
          <img src={group?.avatar} alt="group" />

          {isAdmin && <ChangeGroupAvatar groupID={group?._id} />}
        </div>
        <p className="subject">{group?.subject}</p>
        <p className="members-count">Group * {count} member</p>
      </section>
      <section className="members">
        <p className="heading">{count} member</p>
        <ul>
          {isAdmin && (
            <li onClick={() => openAddMember(true)}>
              <div className="icon flex-center">
                <BiUserPlus size={25} />
              </div>
              <span>add member</span>
            </li>
          )}
        </ul>
        {menuVisible && (
          <AdminActions
            groupID={group._id}
            member={member}
            onClose={() => setMenuVisible(false)}
            style={{ top: menuPosition.y, left: menuPosition.x }}
          />
        )}
        {group?.members?.map((member) => (
          <Link
            to={`/conversation/${member?.user?._id}`}
            onClick={(event) => {
              if (member?.user?._id === user._id) {
                event.preventDefault();
              }
              setMenuVisible(false);
            }}
            onContextMenu={(event) => {
              event.preventDefault();
              console.log(event);
              if (member?.user?._id !== user._id && isAdmin) {
                setMenuPosition({ x: event.clientX, y: event.clientY });
                setMember(member);
                setMenuVisible(true);
              }
            }}
            onDoubleClick={() => {}}
            state={{ isSearch: false, receiver: member?.user }}
            key={member?.user?._id}
            className="member-container"
          >
            <UserCard user={member?.user} _id={user._id} />
            {member?.role === "admin" && (
              <span className="admin rounded">Group Admin</span>
            )}
          </Link>
        ))}
      </section>
      {addMemberIsOpen && (
        <section className="add-members flex-center">
          <div
            className="overlay pointer"
            onClick={() => openAddMember(false)}
          ></div>
          <AddMember
            onClick={() => openAddMember(false)}
            groupID={group._id}
            connection={connection}
          />
        </section>
      )}
      <section className="settings">
        <button className="exit-group" onClick={handleGroupExit}>
          <BiExit size={25} />
          <p>exit group</p>
        </button>
        {isAdmin && (
          <button className="delete-group" onClick={handleGroupDelete}>
            <BiRecycle size={25} />
            <p>delete group</p>
          </button>
        )}
      </section>
    </div>
  );
};

const AddMember = ({ onClick, connection, groupID }) => {
  const [contacts, setContacts] = useState([]);
  const [selected, setSelected] = useState([]);
  const dispatch = useDispatch();
  const handleCheckboxChange = useCallback((contactId) => {
    setSelected((prev) =>
      prev.includes(contactId)
        ? prev.filter((id) => id !== contactId)
        : [...prev, contactId]
    );
  }, []);

  const fetchContacts = useCallback(async () => {
    try {
      console.log("fetching");

      const response = await api.get(
        `api/v1/groups/${groupID}/contacts-to-add`
      );
      if (response.status === 200) {
        setContacts(response.data.data.contacts);
      }
    } catch (error) {
      console.log(error);
    }
  }, [groupID]);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);
  const handleSend = () => {
    connection.emit("add-members", { groupID, members: selected }, (data) => {
      console.log(data);
      if (data.success) {
        dispatch(setGroup(data.group));
        onClick();
      }
    });
  };
  console.log(selected);
  return (
    <div className="add-member-panel">
      <div className="heading">
        <BiX size={40} onClick={onClick} className="pointer" />
        <h2>add member</h2>
      </div>
      <p>contacts</p>
      <div className="contacts">
        {contacts.map((contact) => (
          <div
            className={`contact ${
              selected.includes(contact._id) ? "selected" : ""
            }`}
            onClick={() => handleCheckboxChange(contact._id)}
            key={contact._id}
          >
            <div className="member-container pointer">
              <input
                type="checkbox"
                checked={selected.includes(contact._id)}
                readOnly
              />
              <UserCard user={contact} _id={""} />
            </div>
          </div>
        ))}
      </div>
      {selected.length > 0 && (
        <div className="add-button pointer flex-center" onClick={handleSend}>
          <BiSend size={25} />
        </div>
      )}
    </div>
  );
};

const UserCard = ({ user, _id }) => {
  return (
    <Fragment>
      <Avatar user={user} />
      <div className="text-container">
        <p>{user?._id === _id ? "you" : user?.name}</p>
        <p>{user?.about}</p>
      </div>
    </Fragment>
  );
};

const AdminActions = ({ member, groupID, onClose, style }) => {
  const connection = useSelector((state) => state.app.connection);
  const dispatch = useDispatch();

  const changeRole = (role) => {
    if (connection) {
      connection.emit(
        "edit-role",
        { role, groupID, userID: member.user._id },
        (data) => {
          if (data.success) {
            dispatch(setGroup(data.group));
            toast.success("Role updated successfully");
          }
        }
      );
    }
  };
  return (
    <div
      className="admin-actions shadow rounded"
      onClick={onClose}
      style={style}
    >
      <ul>
        {member.role !== "admin" && (
          <li
            onClick={() => {
              changeRole("admin");
              onClose();
            }}
          >
            upgrade to admin
          </li>
        )}
        {member.role === "admin" && (
          <li
            onClick={() => {
              changeRole("member");
              onClose();
            }}
          >
            downgrade to member
          </li>
        )}
        <li
          onClick={(event) => {
            event.stopPropagation();
            if (connection) {
              connection.emit(
                "exit-group",
                {
                  groupID,
                  userID: member.user._id,
                },
                (data) => {
                  if (data.success) {
                    toast.success("user removed successfully");
                    dispatch(setGroup(data.group));
                  }
                }
              );
            }
            onClose();
          }}
        >
          remove from group
        </li>
      </ul>
    </div>
  );
};
