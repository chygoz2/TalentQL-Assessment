const { DataTypes } = require("sequelize");

module.exports = (connection) => {
  const User = require("./User")(connection);

  const Reply = connection.define("reply", {
    body: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    postId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });

  Reply.belongsTo(User);

  return Reply;
};
