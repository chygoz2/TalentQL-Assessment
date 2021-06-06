require("dotenv").config();
const express = require("express");
const app = express();
const statusCodes = require("./app/constants/statusCodes");
const { responseService } = require("./app/utils");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

app.get("/", (req, res) => {
  return responseService(res, statusCodes.OK, "OK", {
    version: "v1",
  });
});

app.use("/api/v1/auth", require("./app/controllers/AuthController"));
app.use("/api/v1/posts", require("./app/controllers/PostController"));

app.get("*", (req, res) => {
  return responseService(res, statusCodes.NOT_FOUND, "Unknown route");
});

const PORT = process.env.SERVER_PORT || 3000;
app.listen(PORT, () => {
  console.log("Server is running on port: " + PORT);
});
