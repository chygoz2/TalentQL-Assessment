require("dotenv").config();
const express = require("express");
const app = express();
const db = require("./app/models");
const StatusCodes = require("./app/constants/statusCodes");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

db.connection.sync({ alter: true });

app.get("/", (req, res) => {
  res.status(StatusCodes.OK).json({
    version: "v1",
  });
});

app.use("/api/v1/auth", require("./app/controllers/AuthController"));
app.use("/api/v1/posts", require("./app/controllers/PostController"));

const PORT = process.env.SERVER_PORT || 3000;
app.listen(PORT, () => {
  console.log("Server is running on port: " + PORT);
});
