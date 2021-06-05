const { DataTypes } = require("sequelize");
const bcrypt = require("bcrypt");

module.exports = (connection) => {
  const User = connection.define(
    "user",
    {
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      emailAddress: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        set(value) {
          const salt = bcrypt.genSaltSync(10);
          this.setDataValue("password", bcrypt.hashSync(value, salt));
        },
      },
    },
  );

  return User;
};
