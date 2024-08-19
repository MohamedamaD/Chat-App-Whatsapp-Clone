const Conversation = require("../models/conversation");
const Group = require("../models/group");
const mongoose = require("mongoose");
const getGroupById = async (payload) => {
  try {
    const groupID = new mongoose.Types.ObjectId(payload);
    const group = await Group.findById(groupID)
      .populate("members.user")
      .populate("messages");
    return group;
  } catch (error) {
    throw error;
  }
};
const getGroupBySubject = () => {};
const getJoinedGroups = async (payload) => {
  try {
    const user = new mongoose.Types.ObjectId(payload);
    const groups = await Group.find({
      members: { $elemMatch: { user } },
    })
      .select("subject avatar")
      .sort({ updatedAt: -1 });
    return groups;
  } catch (error) {
    throw error;
  }
};
const createGroup = async (payload) => {
  try {
    const group = await Group.create(payload);
    return group;
  } catch (error) {
    throw error;
  }
};
const deleteGroup = async (payload) => {
  try {
    const groupID = new mongoose.Types.ObjectId(payload.groupID);
    await Group.findByIdAndDelete(groupID);
  } catch (error) {
    throw error;
  }
};
const editGroup = async (payload) => {
  try {
    const groupID = new mongoose.Types.ObjectId(payload.groupID);
    const group = await Group.findByIdAndUpdate(groupID, payload.data, {
      new: true,
    })
      .populate("members.user")
      .populate("messages");
    return group;
  } catch (error) {
    throw error;
  }
};
const userIsAdmin = async (payload) => {
  try {
    const groupID = new mongoose.Types.ObjectId(payload.groupID);
    const userID = new mongoose.Types.ObjectId(payload.userID);

    const group = await Group.findOne({
      _id: groupID,
      members: {
        $elemMatch: { user: userID, role: "admin" },
      },
    });

    return group !== null;
  } catch (error) {
    throw error;
  }
};
const exitUserFromGroup = async (payload) => {
  try {
    const groupID = new mongoose.Types.ObjectId(payload.groupID);
    const userID = new mongoose.Types.ObjectId(payload.userID);

    const group = await Group.findByIdAndUpdate(
      groupID,
      {
        $pull: { members: { user: userID } },
      },
      { new: true }
    );

    return group;
  } catch (error) {
    throw error;
  }
};
const addMembers = async (payload) => {
  try {
    const groupID = new mongoose.Types.ObjectId(payload.groupID);

    const members = payload.members.map((member) => ({
      user: new mongoose.Types.ObjectId(member),
    }));

    const group = await Group.findByIdAndUpdate(
      groupID,
      {
        $push: { members: { $each: members } },
      },
      { new: true }
    );
    return group;
  } catch (error) {
    throw error;
  }
};
const getUserContactsToAdd = async (req, res, next) => {
  try {
    const userObjectId = new mongoose.Types.ObjectId(req.body.decoded.user._id);
    const conversations = await Conversation.aggregate([
      {
        $match: {
          $or: [{ sender: userObjectId }, { receiver: userObjectId }],
        },
      },
      {
        $project: {
          users: ["$sender", "$receiver"],
        },
      },
      {
        $unwind: "$users",
      },
      {
        $match: {
          users: { $ne: userObjectId },
        },
      },
      {
        $group: {
          _id: null,
          uniqueUsers: { $addToSet: "$users" },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "uniqueUsers",
          foreignField: "_id",
          as: "contacts",
        },
      },
      {
        $project: {
          _id: 0,
          contacts: 1,
        },
      },
    ]);

    let contacts = conversations.length > 0 ? conversations[0].contacts : [];
    const { groupID } = req.params;
    const group = await Group.findById(groupID);

    const memberIds = group.members.map((member) => member.user.toString());
    const contactsNotInMembers = contacts.filter(
      (contact) => !memberIds.includes(contact?._id?.toString())
    );

    res.json({
      message: "user contacts",
      data: {
        contacts: contactsNotInMembers,
      },
    });
  } catch (error) {
    res.status(500).send("Internal server error");
  }
};

const pushMessagesIntoGroup = async (payload) => {
  try {
    const groupID = new mongoose.Types.ObjectId(payload.groupID);
    const group = await Group.findByIdAndUpdate(
      groupID,
      {
        $push: { messages: payload.messageID },
      },
      { new: true }
    );
    return group;
  } catch (error) {}
};

const editUserRole = async (payload) => {
  try {
    const groupID = new mongoose.Types.ObjectId(payload.groupID);
    const userID = new mongoose.Types.ObjectId(payload.userID);
    const role = payload.role;

    const group = await Group.findOneAndUpdate(
      { _id: groupID, "members.user": userID },
      { $set: { "members.$.role": role } },
      { new: true }
    ).populate("members.user");
    return group;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createGroup,
  deleteGroup,
  getGroupBySubject,
  editGroup,
  getGroupById,
  getJoinedGroups,
  userIsAdmin,
  exitUserFromGroup,
  addMembers,
  getUserContactsToAdd,
  pushMessagesIntoGroup,
  editUserRole,
};
