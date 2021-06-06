const { DataTypes } = require("sequelize");

module.exports = (connection) => {
  const User = require("./User")(connection);
  const Reply = require("./Reply")(connection);

  const Post = connection.define("post", {
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

  Post.hasMany(Reply, { as: 'replies' })

  return Post;
};
