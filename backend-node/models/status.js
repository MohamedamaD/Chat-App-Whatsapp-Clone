const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var StatusSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    imageUrl: { type: String, default: "" },
    videoUrl: { type: String, default: "" },
    text: { type: String, default: "" },
    color: { type: String, default: "" },

    seenBy: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        default: [],
      },
    ],

    createdAt: {
      type: Date,
      default: Date.now,
      index: { expires: "24h" },
    },
  },
  { timestamps: true }
);

StatusSchema.index({ createdAt: 1 }, { expireAfterSeconds: 24 * 60 * 60 });

var Status = mongoose.model("Status", StatusSchema);
module.exports = Status;
