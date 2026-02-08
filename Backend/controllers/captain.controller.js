const captainModel = require("../models/captain.model");
const { validationResult } = require("express-validator");
const captainService = require("../services/captain.service");
const BlacklistedToken = require("../models/blacklistToken.model");

module.exports.registerCaptain = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { fullname, email, password, vehicle } = req.body;

  const isCaptainAlreadyRegistered = await captainModel.findOne({ email });
  if (isCaptainAlreadyRegistered) {
    return res.status(400).json({ error: "Captain already registered" });
  }

  const hashedPassword = await captainModel.hashPassword(password);
  const { firstname, lastname } = fullname;
  const { color, plate, capacity, vehicleType } = vehicle;
  try {
    const captain = await captainService.createCaptain({
      firstname,
      lastname,
      email,
      password: hashedPassword,
      color,
      plate,
      capacity,
      vehicleType,
    });
    const token = await captain.generateAuthToken();
    res.status(201).json({ captain, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports.loginCaptain = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { email, password } = req.body;
  try {
    const captain = await captainModel.findOne({ email }).select("+password");
    if (!captain) {
      return res.status(400).json({ error: "Invalid email or password" });
    }
    const isPasswordValid = await captain.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: "Invalid email or password" });
    }
    const token = await captain.generateAuthToken();
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 3600000,
    });
    res.status(200).json({ captain, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports.getCaptainProfile = async (req, res) => {
  try {
    const captain = req.captain;
    res.status(200).json({ captain });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports.logoutCaptain = async (req, res) => {
  try {
    const token = req.cookies.token || req.header("Authorization")?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Unauthorized." });
    }
    const blacklistedToken = new BlacklistedToken({ token });
    await blacklistedToken.save();
    res.clearCookie("token");
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};



