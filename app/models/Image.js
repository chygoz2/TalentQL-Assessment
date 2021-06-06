const { DataTypes } = require("sequelize");

module.exports = (connection) => {
  const Image = connection.define("image", {
    postId: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    filePath: {
      allowNull: false,
      type: DataTypes.STRING,
    },
  });

  return Image;
};
