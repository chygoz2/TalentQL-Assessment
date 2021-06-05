require("dotenv").config();
const express = require("express");
const app = express();
const db = require("./app/models");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

db.connection.sync();

app.get("/", (req, res) => {
  res.send(req.query.name);
});

const PORT = process.env.SERVER_PORT || 3000;
app.listen(PORT, () => {
  console.log("Server is running on port: " + PORT);
});
