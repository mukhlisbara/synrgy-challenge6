import {Sequelize} from "sequelize";
import { DataTypes } from "sequelize";
import DB from "../config/database.js";
import Car from "./Car.js";

const TableName = 'users';

const UserFields = {
    username: DataTypes.STRING,
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: DataTypes.STRING,
    token: DataTypes.TEXT,
    role: DataTypes.STRING
}

const User = DB.define(
    TableName, 
    UserFields, 
    {freezeTableName: true}
)

export default User;