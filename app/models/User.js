const { DataTypes } = require("sequelize");

module.exports = (connection) => {
  const User = connection.define("user", {
    firstName: {
      type: DataTypes.STRING,
    },
    lastName: {
      type: DataTypes.STRING,
    },
    emailAddress: {
      type: DataTypes.STRING,
    },
    password: {
      type: DataTypes.STRING,
    },
  });
  
  return User;
};
