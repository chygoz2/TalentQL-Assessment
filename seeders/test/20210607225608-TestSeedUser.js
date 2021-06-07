"use strict";
const bcrypt = require('bcrypt')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const salt = bcrypt.genSaltSync(10);
    const date = new Date().toISOString().slice(0, 19).replace('T', ' ');
    await queryInterface.bulkInsert(
      "users",
      [
        {
          firstName: "Mickey",
          lastName: "Mouse",
          emailAddress: "mickey@example.com",
          password: bcrypt.hashSync('123456', salt),
          createdAt: date,
          updatedAt: date
        },
        {
          firstName: "Donald",
          lastName: "Duck",
          emailAddress: "donald@example.com",
          password: bcrypt.hashSync('123456', salt),
          createdAt: date,
          updatedAt: date
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('users', null, {});
  },
};
