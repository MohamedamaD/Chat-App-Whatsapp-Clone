const Status = require("../models/status");

//CURD
const createStatus = async (payload) => {
  try {
    const status = new Status(payload);
    await status.save();
    console.log("Status created successfully:", status);
    return status;
  } catch (error) {
    console.error("Error creating status:", error);
    throw error;
  }
};

const getStatusById = async (payload) => {
  try {
    const status = await Status.findById(payload).populate("user");
    if (!status) {
      throw new Error("Status not found");
    }
    console.log("Status found:", status);
    return status;
  } catch (error) {
    console.error("Error fetching status by ID:", error);
    throw error;
  }
};

const markStatusAsSeen = async (payload) => {
  try {
    const { statusId, userId } = payload;

    const status = await Status.findByIdAndUpdate(
      statusId,
      { $addToSet: { seenBy: userId } },
      { new: true }
    ).populate("user seenBy");

    if (!status) {
      throw new Error("Status not found");
    }

    console.log("Status marked as seen:", status);
    return status;
  } catch (error) {
    console.error("Error marking status as seen:", error);
    throw error;
  }
};

const deleteStatus = async (payload) => {
  try {
    const status = await Status.findByIdAndDelete(payload);
    if (!status) {
      throw new Error("Status not found");
    }
    console.log("Status deleted successfully:", status);
    return status;
  } catch (error) {
    console.error("Error deleting status:", error);
    throw error;
  }
};

const getMyStatus = async (payload) => {
  try {
    const statuses = await Status.find({ user: payload.user }).populate("user");

    return statuses;
  } catch (error) {
    console.error("Error get statuses:", error);
    throw error;
  }
};

const getLatestStatus = async (payload) => {
  try {
    const status = await Status.findOne({ user: payload.user })
      .sort({ createdAt: -1 })
      .populate("user");

    return status;
  } catch (error) {
    console.error("Error getting latest status:", error);
    throw error;
  }
};

module.exports = {
  createStatus,
  getStatusById,
  deleteStatus,
  markStatusAsSeen,
  getMyStatus,
  getLatestStatus,
};
