const { DataTypes } = require("sequelize");

module.exports = (connection) => {
  const User = require("./User")(connection);
//   const Post = require("./Post")(connection);

  const Reply = connection.define("reply", {
    body: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    postId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    //   references: {
    //     model: Post,
    //     key: "id",
    //   },
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
  });

//   Reply.belongsTo(Post);
  Reply.belongsTo(User);
  return Reply;
};
