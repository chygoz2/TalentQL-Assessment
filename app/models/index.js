const { Sequelize } = require("sequelize");
const config = require('../../config/config')[process.env.NODE_ENV]

const connection = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    port: config.port,
    dialect: config.dialect,
    logging: false
  }
);

const db = {
  connection,
  Users: require("./User.js")(connection),
  Posts: require("./Post.js")(connection),
  Replies: require("./Reply.js")(connection),
  Likes: require("./Like.js")(connection),
  Images: require("./Image.js")(connection),
};

module.exports = db;
