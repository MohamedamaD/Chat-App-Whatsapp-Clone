const { default: mongoose } = require("mongoose");
const Conversation = require("../models/conversation");
const Message = require("../models/message");

const getConversation = async (payload) => {
  const { sender, receiver } = payload;
  const conversation = await Conversation.findOne({
    $or: [
      { sender, receiver },
      { sender: receiver, receiver: sender },
    ],
  })
    .populate("messages")
    .sort({ createdAt: -1 });

  return conversation;
};

const createConversation = async (payload) => {
  const { sender, receiver } = payload;
  const conversation = new Conversation({ sender, receiver });
  await conversation.save();

  return conversation;
};
const deleteConversation = async (payload) => {
  await Conversation.findByIdAndDelete(payload);
};

const pushMessageInfoConversation = async (payload) => {
  const { _id, MessageId } = payload;
  const conversation = await Conversation.findByIdAndUpdate(
    _id,
    {
      $push: { messages: MessageId },
      lastMessage: MessageId,
    },
    { new: true }
  )
    .populate("sender")
    .populate("receiver")
    .populate("lastMessage")
    .select("-messages")
    .sort({ createdAt: -1 });

  return conversation;
};

const getUserConversations = async (payload) => {
  const conversations = await Conversation.find({
    $or: [{ sender: payload }, { receiver: payload }],
  })
    .populate("receiver")
    .populate("sender")
    .populate("lastMessage")
    .select("-messages")
    .sort({ updatedAt: -1 });

  return conversations;
};

const getOnlineContacts = async (payload) => {
  payload = new mongoose.Types.ObjectId(payload);
  const onlineContacts = await Conversation.aggregate([
    {
      $match: {
        $or: [{ sender: payload }, { receiver: payload }],
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "sender",
        foreignField: "_id",
        as: "senderDetails",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "receiver",
        foreignField: "_id",
        as: "receiverDetails",
      },
    },
    {
      $unwind: "$senderDetails",
    },
    {
      $unwind: "$receiverDetails",
    },
    {
      $project: {
        user: {
          $cond: {
            if: { $eq: ["$sender", payload] },
            then: "$receiverDetails",
            else: "$senderDetails",
          },
        },
      },
    },
    {
      $match: {
        "user.online": true,
      },
    },
    {
      $group: {
        _id: "$user._id",
        user: { $first: "$user" },
      },
    },
    {
      $replaceRoot: { newRoot: "$user" },
    },
  ]);
  return onlineContacts;
};
const updateMessagesStatus = async (payload) => {
  const { sender, receiver } = payload;

  let conversation = await Conversation.findOne({
    $or: [
      { sender, receiver },
      { sender: receiver, receiver: sender },
    ],
  });

  let messages = conversation?.messages || [];

  const updatedMessages = await Message.updateMany(
    {
      _id: { $in: messages },
      owner: receiver,
    },
    { $set: { seen: true } }
  );

  conversation = await getConversation(payload);
  messages = conversation?.messages || [];
  return messages;
};

const getUserContacts = async (req, res) => {
  try {
    // Aggregation pipeline
    const contacts = await getContacts(req.body.decoded.user._id);

    res.json({
      message: "user contacts",
      data: {
        contacts,
      },
    });
  } catch (error) {
    console.log("error message from getUserContacts", error);
    res.status(500).send("internal server error");
  }
};

const getContacts = async (payload) => {
  const userObjectId = new mongoose.Types.ObjectId(payload);

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
  return conversations.length > 0 ? conversations[0].contacts : [];
};

module.exports = {
  // user conversation
  getConversation,
  getUserConversations,
  createConversation,
  deleteConversation,
  updateMessagesStatus,
  pushMessageInfoConversation,

  // contacts
  getOnlineContacts,
  getUserContacts,
  getContacts,
};
