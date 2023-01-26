"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Users", [
      {
        username: "MegFromWalnutCreek",
        firstname: "Meg",
        lastname: "Divringi",
        password: "ABC123",
        admin: true,
        zip: 94596,
        districtid: 11,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: "Frito",
        firstname: "James",
        lastname: "Jamerson",
        password: "password",
        admin: false,
        zip: 10002,
        districtid: 12,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Users", null, { restartIdentity: true });
  },
};
