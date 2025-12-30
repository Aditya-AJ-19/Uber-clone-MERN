const mongoose = require("mongoose");

function connectToDB() {
  const dbURI =
    process.env.MONGODB_URI || "mongodb://localhost:27017/uber-clone";

  mongoose
    .connect(dbURI)
    .then(() => {
      console.log("Connected to MongoDB");
    })
    .catch((err) => {
      console.error("Error connecting to MongoDB:", err);
    });
}

module.exports = connectToDB;
