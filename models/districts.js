"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Districts extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Districts.belongsTo(models.Users, {
        foreignKey: "districtid",
      });
      Districts.belongsTo(models.Positions, {
        foreignKey: "districtid",
      });
    }
  }
  Districts.init(
    {
      county: DataTypes.STRING,
      state: DataTypes.STRING,
      population: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Districts",
    }
  );
  return Districts;
};
