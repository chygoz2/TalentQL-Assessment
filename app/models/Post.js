const { DataTypes } = require("sequelize");

module.exports = (connection) => {
  const User = require("./User")(connection);

  const Post = connection.define("post", {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    body: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    creatorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
  });

  return Post;
};
