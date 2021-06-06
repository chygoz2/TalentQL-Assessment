const { DataTypes } = require("sequelize");

module.exports = (connection) => {
  const Like = connection.define("like", {
    postId: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    userId: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
  });

  return Like;
};
