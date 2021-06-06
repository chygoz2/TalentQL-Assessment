const { DataTypes } = require("sequelize");

module.exports = (connection) => {
  const User = require("./User")(connection);

  const Like = connection.define("like", {
    postId: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    userId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: "id",
      },
    },
  });

  return Like;
};
