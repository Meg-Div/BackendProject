"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Positions extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Positions.hasOne(models.Districts, {
        foreignKey: "id",
      });
    }
  }
  Positions.init(
    {
      positiontitle: DataTypes.STRING,
      positiondescription: DataTypes.STRING,
      votingcutoff: DataTypes.STRING,
      candidates: DataTypes.ARRAY(DataTypes.STRING),
      districtid: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Positions",
    }
  );
  return Positions;
};
