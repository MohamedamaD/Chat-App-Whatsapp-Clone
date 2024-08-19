const mongoose = require("mongoose");
const { hashPassword } = require("../utils/hash");
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "name is required"],
    },
    email: {
      type: String,
      unique: true,
      required: [true, "email is required"],
    },
    password: {
      type: String,
      required: [true, "password is required"],
    },
    avatar: {
      type: String,
      default: "",
    },
    about: {
      type: String,
      default: "hello world",
    },
    online: {
      type: Boolean,
      default: false,
    },
    socketId: {
      type: String,
      default: null,
    },
    resetToken: {
      type: String,
      default: "",
    },
    resetTokenExpires: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  const user = this;
  user.password = await hashPassword(user.password);

  next();
});

const User = mongoose.model("User", UserSchema);
module.exports = User;
