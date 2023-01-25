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
    await queryInterface.bulkInsert("Positions", [
      {
        positiontitle: "Mayor",
        positiondescription:
          "The Mayor shall be the chief elective officer of the City, responsible for providing leadership and taking issues to the people and marshalling public interest in and support for municipal activity",
        votingcutoff: new Date().add(30).days(),
        candidates: ["Zebra", "Rhino", "Buffalo"],
        districtid: 1,
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
