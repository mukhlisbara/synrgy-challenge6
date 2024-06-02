import { DataTypes, Sequelize, Model } from "sequelize";
import DB from "../config/database.js";

const TableName = "cars";

const CarField = {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    rentPrice: DataTypes.DOUBLE,
    size: DataTypes.STRING,
    image: DataTypes.STRING,
    created_by: {
        type: DataTypes.STRING,
        allowNull: false
    },
    updated_by: {
        type: DataTypes.STRING,
        allowNull: false
    },
    deleted_by: {
        type: DataTypes.STRING,
        allowNull: true
    }
}

const Car = DB.define(
    TableName, 
    CarField, 
    {freezeTableName: true, paranoid: true}
)

export default Car;