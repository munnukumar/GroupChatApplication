const { DataTypes } = require("sequelize");

const database = require("../util/database");

const Messages = database.define("messages", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    message: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    sender: {
        type: DataTypes.STRING,
        allowNull: false,
    }
});

module.exports = Messages;