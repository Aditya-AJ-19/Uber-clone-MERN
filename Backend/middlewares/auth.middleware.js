const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const blacklistedToken = require("../models/blacklistToken.model");
const captainModel = require("../models/captain.model");

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

module.exports.authCaptain = async (req, res, next) => {
  try {
    const token =
      req.cookies.token || req.header("Authorization")?.split(" ")[1];
    if (!token) {
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
    const captain = await captainModel.findById(decoded._id);
    if (!captain) {
      return res.status(401).json({
        message: "Unauthorized.",
      });
    }
    req.captain = captain;
    return next();
  } catch (error) {
    console.log(error);
    res.status(401).json({
      message: "Unauthorized.",
    });
  }
};
