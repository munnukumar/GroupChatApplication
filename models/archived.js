const DataTypes  = require("sequelize");

const database = require("../util/database");

const Archived = database.define("Archived", {
    message: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    sender: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

module.exports = Archived;