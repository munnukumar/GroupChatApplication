const DataTypes  = require("sequelize");

const database = require("../util/database");

const Group = database.define("Group", {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    adminId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
})

module.exports = Group;