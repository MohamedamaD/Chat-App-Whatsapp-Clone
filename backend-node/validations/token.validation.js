const { verifyToken } = require("../utils/JWT");

const validateToken = async (req, res, next) => {
  try {
    const token = req.cookies.token || "";
    const decoded = verifyToken(token);

    if (!decoded) {
      res.status(400).json({ message: "Invalid token provided" });
      return;
    }
    req.body.decoded = decoded;
    next();
  } catch (error) {
    // console.log(error);
    res.status(500).json({
      message: error.message || error,
    });
  }
};

module.exports = { validateToken };
