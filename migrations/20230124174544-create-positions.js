"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Positions", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      districtid: {
        type: Sequelize.INTEGER,
        references: {
          model: "Districts",
          key: "id",
          as: "districtid",
        },
      },
      positiontitle: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      positiondescription: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      votingcutoff: {
        type: Sequelize.STRING,
      },
      candidates: {
        type: Sequelize.ARRAY({
          type: Sequelize.STRING,
        }),
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Positions");
  },
};
