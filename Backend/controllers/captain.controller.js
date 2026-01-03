const captainModel = require("../models/captain.model");
const { validationResult } = require("express-validator");
const captainService = require("../services/captain.service");

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
