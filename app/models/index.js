const { Sequelize } = require("sequelize");

const connection = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "mysql",
  }
);

const db = {
  Users: require("./User.js")(connection),
  Posts: require("./Post.js")(connection),
  Replies: require("./Reply.js")(connection),
  Likes: require("./Like.js")(connection),
};

module.exports = db;
