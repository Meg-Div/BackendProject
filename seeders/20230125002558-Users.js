"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    await queryInterface.bulkInsert("Users", [
      {
        username: "MegFromWalnutCreek",
        firstname: "Meg",
        lastname: "Divringi",
        password: "ABC123",
        admin: true,
        zip: 94596,
        districtid: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: "Frito",
        firstname: "James",
        lastname: "Jamerson",
        password: "password",
        admin: false,
        zip: 94598,
        districtid: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
