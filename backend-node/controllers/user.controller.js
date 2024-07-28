const sendMail = require("../mails/nodemailer");
const User = require("../models/user");
const { comparePassword } = require("../utils/hash");
const { generateToken, verifyToken } = require("../utils/JWT");
const userValidator = require("../validations/user.validation");
const crypto = require("crypto");

const register = async (req, res, next) => {
  try {
    const userData = req.body;
    const { value, error } = userValidator.validate(userData);

    if (error) {
      res.status(401).json({
        message: error.message,
      });
      return;
    }

    const existUser = await User.findOne({ email: value.email });
    if (existUser) {
      res.status(401).json({
        message: "User already exists try another email address",
      });
      return;
    }

    const user = await User.create(value);
    user.password = null;

    const token = generateToken({ user });
    console.log(token);

    res
      .status(201)
      .cookie("token", token, { HttpOnly: true, secure: true })
      .json({ message: "user created successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message || error,
    });
  }
};
const getUserByEmail = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email }).select("-password");
    if (!user) {
      res.status(400).json({
        message: "User not exist",
      });
      return;
    }
    res.status(200).json({ message: "user exist", data: { user } });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message || error,
    });
  }
};
const login = async (req, res, next) => {
  try {
    const { userId, password } = req.body;
    const user = await User.findById(userId);
    const s = await User.findById(userId).lean();

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      res.status(403).json({ message: "Password mismatch" });
      return;
    }

    user.password = null;
    const token = generateToken({ user });

    res.status(200).cookie("token", token, { http: true, secure: true }).json({
      message: "user login successfully",
      data: {
        user,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message || error,
    });
  }
};
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(400).json({ message: "this email not exist" });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetToken = resetToken;
    user.resetTokenExpires = Date.now() + 3600000;
    await user.save();

    console.log(user);

    const resetLink = `${process.env.CLIENT_URL}/auth/reset-password?token=${resetToken}&email=${email}`;

    await sendMail(
      email,
      "Password Reset",
      `You requested a password reset. Click the link to reset your password: ${resetLink}`,
      `<p>You requested a password reset. Click the link to reset your password:</p><a href="${resetLink}">Reset Password</a>`
    );

    res
      .status(200)
      .json({ message: "Password reset email sent", sendMail: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message || error,
    });
  }
};
const resetPassword = async (req, res, next) => {
  try {
    const { token, email, newPassword } = req.body;
    const user = await User.findOne({
      email,
      resetToken: token,
      resetTokenExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "expired token" });
    }

    user.password = newPassword;
    user.resetToken = null;
    user.resetTokenExpires = null;
    await user.save();

    res
      .status(200)
      .json({ message: "Password has been reset successfully", user });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message || error,
    });
  }
};
const logout = async (req, res, next) => {
  try {
    res
      .clearCookie("token", { http: true, secure: true })
      .json({ message: " logged out" });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message || error,
    });
  }
};
const getUserDetails = async (req, res, next) => {
  try {
    const { decoded } = req.body;
    const user = await User.findOne({ email: decoded.email }).select(
      "-password"
    );
    res.status(200).json({ data: { user } });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message || error,
    });
  }
};
const protected = async (req, res, next) => {
  try {
    const { decoded } = req.body;

    res
      .status(200)
      .json({ message: "This is protected data", user: decoded.user });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message || error,
    });
  }
};
const editUserDetails = async (req, res, next) => {
  const { decoded, data } = req.body;
  try {
    const user = await User.findByIdAndUpdate(decoded.user?._id, data, {
      new: true,
    }).select("-password");

    const token = generateToken({
      user,
    });

    res.status(200).cookie("token", token, { http: true, secure: true }).json({
      message: "updated successfully",
      data: {
        user,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message || error,
    });
  }
};
const userSearch = async (req, res, next) => {
  const searchQuery = req.query.q;

  try {
    const regexQuery = new RegExp(searchQuery, "ig");
    const users = await User.find({
      $or: [{ name: regexQuery }, { email: regexQuery }],
    });

    res.status(200).json({ message: "success query", data: users });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message || error,
    });
  }
};
const setUserOnline = async (payload) => {
  try {
    await User.findByIdAndUpdate(
      payload._id,
      {
        online: payload.online,
        socketId: payload.socketId,
      },
      { new: true }
    );
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  register,
  getUserByEmail,
  login,
  logout,
  getUserDetails,
  protected,
  editUserDetails,
  userSearch,
  setUserOnline,
  resetPassword,
  forgotPassword,
};
