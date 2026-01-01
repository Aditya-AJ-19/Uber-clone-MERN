const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const app = express();
const connectToDB = require("./db/db");
const userRouter = require("./routes/user.routes");

connectToDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/users", userRouter);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

module.exports = app;
