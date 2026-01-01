const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const blacklistedToken = require("../models/blacklistToken.model");

module.exports.authUser = async (req, res, next) => {
  try {
    const token =
      req.cookies.token || req.header("Authorization")?.split(" ")[1];
    if (!token) {
      console.log("No token found");
      return res.status(401).json({
        message: "Unauthorized.",
      });
    }
    const isBlacklisted = await blacklistedToken.findOne({ token });
    if (isBlacklisted) {
      return res.status(401).json({
        message: "Unauthorized.",
      });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(decoded._id);
    if (!user) {
      console.log("User not found");
      return res.status(401).json({
        message: "Unauthorized.",
      });
    }
    req.user = user;
    return next();
  } catch (error) {
    console.log(error);
    res.status(401).json({
      message: "Unauthorized.",
    });
  }
};
