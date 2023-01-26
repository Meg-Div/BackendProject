"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Districts", [
      {
        county: "Contra Costa County",
        state: "CA",
        population: "1161000",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        county: "Knox County",
        state: "TN",
        population: "420069",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Districts", null, {
      restartIdentity: true,
    });
  },
};
