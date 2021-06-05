const { DataTypes } = require("sequelize");

module.exports = (connection) => {
  const User = require("./User")(connection);

  const Post = require("./Post")(connection);

  const Reply = connection.define("reply", {
    body: {
      type: DataTypes.TEXT,
    },
    postId: {
      type: DataTypes.INTEGER,
      references: {
        model: Post,
        key: "id",
      },
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: "id",
      },
    },
  });

  Reply.belongsTo(Post);
  Reply.belongsTo(User);
  return Reply;
};
