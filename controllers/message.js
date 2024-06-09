const path = require("path");

const rootDir = require("../util/path");
const Message = require("../models/message");
const database = require("../util/database");
const { Sequelize } = require("sequelize");

exports.getMessages = (req, res, next) => {
    res.sendFile(path.join(rootDir, "client", "message.html"));
}

exports.postMessages = async (req, res, next) => {
    const t = await database.transaction();
    try {
        const message = req.body.message;
        const sender = req.user.name;
        const userId = req.user.id;
        await Message.create({ message: message, sender: sender, UserId: userId });
        await t.commit();
        res.status(200).json({ message: 'Message sent successfully' });
    }
    catch (err) {
        console.error(err.errors[0].message);
        await t.rollback();
        res.status(500).json({ error: err.errors[0].message });
    }
}

exports.getAllMessages = async (req, res, next) => {
    try {
        const messages = await Message.findAll({ where: { GroupId: null } });
        messages.map(message => {
            if (req.user.name == message.sender) {
                return message.sender = `You`;
            }
            else {
                return message.sender;
            }
        });
        res.status(200).json({ message: messages });
    }
    catch (err) {
        console.error(err.errors[0].message);
        res.status(500).json({ error: err.errors[0].message });
    }
}