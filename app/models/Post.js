const { DataTypes } = require("sequelize");

module.exports = (connection) => {
  const Reply = require("./Reply")(connection);
  const Like = require("./Like")(connection);
  const Image = require("./Image")(connection);

  const Post = connection.define("post", {
    body: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    creatorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });

  Post.hasMany(Reply);
  Post.hasMany(Like);
  Post.hasMany(Image);

  return Post;
};
