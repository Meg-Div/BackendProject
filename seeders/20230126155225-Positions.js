"use strict";

let expirationDate = new Date();
expirationDate.setDate(expirationDate.getDate() + 30);

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Positions", [
      {
        positiontitle: "Mayor",
        positiondescription:
          "The Mayor shall be the chief elective officer of the City, responsible for providing leadership and taking issues to the people and marshalling public interest in and support for municipal activity.",
        votingcutoff: expirationDate,
        candidates: ["Zebra", "Rhino", "Buffalo"],
        districtid: 11,
        createdAt: new Date(),
        updatedAt: new Date(),
      },

      {
        positiontitle: "Commissioner",
        positiondescription:
          "Commissioners are responsible for overseeing the county's management and administration, representing county interests at the state and federal level, participating in long-range planning, and managing the county budget and finances.",
        votingcutoff: expirationDate,
        candidates: ["Lemur", "Chimp", "Gorilla"],
        districtid: 12,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Positions", null, {
      restartIdentity: true,
    });
  },
};
