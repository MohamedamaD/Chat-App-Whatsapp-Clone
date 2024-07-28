const Message = require("../models/message");

const getMessage = async (payload) => {
  const message = await Message.findById(payload);
  return message;
};

const createMessage = async (payload) => {
  const { text, owner, imageUrl, videoUrl } = payload;
  const message = new Message({ text, owner, imageUrl, videoUrl });
  await message.save();
  return message;
};

const updateMessage = async (payload) => {
  const { _id, data } = payload;
  const updatedMessage = await Message.findByIdAndUpdate(_id, data, {
    new: true,
  });
  return updatedMessage;
};

const deleteMessage = async (payload) => {
  await Message.findByIdAndDelete(payload);
};

module.exports = { createMessage, updateMessage, deleteMessage, getMessage };
