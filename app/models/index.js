const { Sequelize } = require('sequelize')

const connection = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
  }
);

const db = {
  connection
};

db.Users = require("./User.js")(connection);
db.Posts = require("./Post.js")(connection);
db.Replies = require("./Reply.js")(connection);

module.exports = db;
