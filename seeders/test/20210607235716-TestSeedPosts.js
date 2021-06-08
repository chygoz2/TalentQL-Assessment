"use strict";
const bcrypt = require('bcrypt');
const db = require('../../app/models');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const date = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const mickey = await db.Users.findOne({
      where: {
        emailAddress: 'mickey@example.com'
      }
    })

    const donald = await db.Users.findOne({
      where: {
        emailAddress: 'donald@example.com'
      }
    })
    await queryInterface.bulkInsert(
      "posts",
      [
        {
          body: "First post",
          creatorId: mickey.id,
          createdAt: date,
          updatedAt: date
        },
        {
          body: "Second post",
          creatorId: donald.id,
          createdAt: date,
          updatedAt: date
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('posts', null, {});
  },
};
