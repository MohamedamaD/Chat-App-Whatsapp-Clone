// imports
const http = require("http");
const express = require("express");
const Server = require("socket.io").Server;
const corsConfig = require("../configuration/cors");
const { verifyToken } = require("../utils/JWT");
const { setUserOnline } = require("../controllers/user.controller");
const {
  getConversation,
  createConversation,
  pushMessageInfoConversation,
  getUserConversations,
  getOnlineContacts,
  deleteConversation,
  updateMessagesStatus,
  getUserContacts,
  getContacts,
} = require("../controllers/conversation.controller");
const { createMessage } = require("../controllers/message.controller");
const {
  createGroup,
  getJoinedGroups,
  getGroupById,
  userIsAdmin,
  editGroup,
  exitUserFromGroup,
  addMembers,
  pushMessagesIntoGroup,
  editUserRole,
  deleteGroup,
} = require("../controllers/group.controller");
const {
  createStatus,
  getMyStatus,
  getLatestStatus,
} = require("../controllers/status.controller");

// initiations
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: corsConfig,
});

// io configurations
io.on("connection", (socket) => {
  const token = socket.handshake.auth.token || "";

  // get user credentials from token
  try {
    const decoded = verifyToken(token);
    socket.user = decoded.user;
  } catch (error) {
    socket.disconnect(true);
    return;
  }

  // our actions
  if (socket.user) {
    // update user credentials to match current state -> online
    setUserOnline({
      _id: socket.user._id,
      online: true,
      socketId: socket.id,
    });

    socket.join(socket.user._id);

    // send request for all users who's having contact with this user
    socket.on("user-online", async () => {
      const contacts = await getOnlineContacts(socket.user._id);

      contacts.forEach((user) => {
        const payload = {
          userId: socket.user._id,
        };
        socket.to(user._id.toString()).emit("user-online", payload);
      });
    });
    // get users if exist conversation between them
    socket.on("user-conversations", async (data) => {
      const sender = data.sender;
      const userConversations = await getUserConversations(sender);

      socket.emit("user-conversations", userConversations);
    });
    // get chat messages between sender and receiver
    socket.on("chat-messages", async (data) => {
      const { sender, receiver } = data;
      const conversation = await getConversation({ sender, receiver });

      socket.emit("chat-messages", conversation?.messages || []); // can be empty || null
    });
    // create a new message
    socket.on("create-message", async (data) => {
      // create conversation if not already existing
      const { sender, receiver } = data;
      let conversation = await getConversation({ sender, receiver });
      let isNew = false; // if remaining false so we need to update in clint side later if change to true so we push in clint side directly

      if (!conversation) {
        conversation = await createConversation({ sender, receiver });
        isNew = true;
      }

      // create message and push it to the conversation
      const { text, imageUrl, videoUrl, owner } = data;
      const message = await createMessage({ text, imageUrl, videoUrl, owner });

      conversation = await pushMessageInfoConversation({
        _id: conversation._id,
        MessageId: message._id,
      });

      // send message to users in room
      socket.emit("new-message", { sender: receiver, message });
      socket.to(receiver).emit("new-message", { sender, message });

      // update conversation list
      const payload = {
        conversation,
        isNew,
      };

      socket.emit("update-conversations", payload);
      socket.to(receiver).emit("update-conversations", payload);
    });
    // seen messages
    socket.on("seen-messages", async (data) => {
      const payload = { ...data, sender: socket.user?._id };
      const messages = await updateMessagesStatus(payload);
      socket.emit("seen-messages", messages);
      socket
        .to(payload.receiver)
        .emit("seen-messages", { messages, sender: payload.sender });
    });
    // set and reset typing
    socket.on("typing", (data) => {
      const { sender, receiver } = data;
      socket.to(receiver).emit("typing", { sender });

      clearTimeout(socket.typingTimeout);
      socket.typingTimeout = setTimeout(() => {
        socket.to(receiver).emit("stop-typing", { sender });
      }, 3000);
    });
    // create and notify group members
    socket.on("create-group", async (data, callback) => {
      // construct group object
      data.members.push({ user: socket.user._id, role: "admin" });
      let payload = {
        members: data.members,
        avatar: data.avatar,
        subject: data.subject,
      };

      const group = await createGroup(payload);
      await group.populate("members.user");

      payload = {
        _id: group._id,
        avatar: group.avatar,
        subject: group.subject,
      };

      // notify group members
      data.members.forEach((member) => {
        io.to(member.user).emit("join-group", payload);
      });

      callback({ success: true, group });
    });
    // get joined groups
    socket.on("get-joined-groups", async (_, callback) => {
      const groups = await getJoinedGroups(socket.user._id);
      callback({ success: true, groups });
    });

    // get group by id
    socket.on("get-group", async (data, callback) => {
      const group = await getGroupById(data.groupID);
      callback({ success: true, group });
    });
    // get group messages
    socket.on("get-group-messages", async (data, callback) => {
      const group = await getGroupById(data.groupID);
      await group.populate("messages.owner");
      callback({ success: true, messages: group.messages });
    });
    // update group if user is admin
    socket.on("update-group", async (data, callback) => {
      // validate first
      const isAdmin = await userIsAdmin({
        userID: socket.user._id,
        groupID: data.groupID,
      });
      if (isAdmin) {
        const group = await editGroup(data);
        // notify users that group has been updated
        group.members.forEach((member) => {
          io.to(member.user._id.toString()).emit("group-updated", group);
        });

        callback({ success: true, group });
      } else {
        callback({ success: false });
      }
    });
    // exit user from group
    socket.on("exit-group", async (data, callback) => {
      const { userID, groupID } = data;
      const group = await exitUserFromGroup({ userID, groupID });
      await group.populate("members.user");
      callback({ success: true, group });
    });
    // delete group
    socket.on("delete-group", async (data, callback) => {
      const { groupID } = data;
      await deleteGroup({ groupID });
      callback({ success: true });
    });
    // send group message
    socket.on("send-group-message", async (data) => {
      const { groupID, text, imageUrl, videoUrl, owner } = data;
      const message = await createMessage({ text, imageUrl, videoUrl, owner });

      await message.populate("owner");

      const group = await pushMessagesIntoGroup({
        groupID,
        messageID: message._id,
      });

      // send message to users in group if open
      const payload = {
        groupID,
        message,
      };

      group.members.forEach((member) => {
        io.to(member.user.toString()).emit("new-message", payload);
      });
    });
    // add members to group
    socket.on("add-members", async (data, callback) => {
      const { members, groupID } = data;
      const group = await addMembers({ members, groupID });
      await group.populate("members.user");
      callback({ success: true, group });
    });
    // edit user role in group
    socket.on("edit-role", async (data, callback) => {
      const { role, groupID, userID } = data;
      const group = await editUserRole({ role, groupID, userID });
      callback({ success: true, group });
    });

    // create status
    socket.on("create-status", async (data, callback) => {
      const status = await createStatus(data);
      callback({ success: true, status });

      // notify user contacts
      const contacts = await getOnlineContacts(data.user);
      await status.populate("user");

      contacts.forEach((user) => {
        const payload = {
          user: status.user,
          createdAt: status.createdAt,
        };
        io.to(user._id.toString()).emit("new-status", payload);
      });
    });
    // get user status
    socket.on("my-status", async (data, callback) => {
      const statuses = await getMyStatus({ user: data.user });
      callback({ success: true, statuses });
    });
    // get contacts status
    socket.on("contacts-status", async (data, callback) => {
      const contacts = await getContacts(data.user);
      var contactsStatus = contacts.map(async (contact) => {
        const status = await getLatestStatus({ user: contact._id });
        if (status) return { user: status.user, createdAt: status.createdAt };

        return null;
      });

      contactsStatus = await Promise.all(contactsStatus);
      contactsStatus = contactsStatus.filter((statuses) => statuses !== null);

      callback({ success: true, contactsStatus });
    });
  }

  socket.on("disconnect", async () => {
    // update user credentials to match current state -> offline
    setUserOnline({
      _id: socket.user._id,
      online: false,
      socketId: null,
    });

    const contacts = await getOnlineContacts(socket.user._id);
    contacts.forEach((user) => {
      const payload = {
        userId: socket.user._id,
      };
      socket.to(user._id.toString()).emit("user-offline", payload);
    });

    socket.leave(socket.user._id);
  });
});

module.exports = {
  app,
  server,
};

// - [x] Typing task is complete
// - [x] Create message and response message complete
// - [x] Update user conversation list complete
// - [x] Retrieve chat is complete
// - [x] online/offline state is complete
// - [x] message seen state is complete
// - [x] create group & notify users is complete
// - [x] retrieve joined groups for user is complete
// - [x] admin update groups and notify members is complete
// - [x] send and receive in group is complete
// - [x] admin actions in group (change roles - exit members - delete groups - edit group info ) is complete
// - [x] create status is complete
// - [x] get status is complete
