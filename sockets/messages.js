const Message = require("../models/message")
const database = require("../util/database")

exports.postMessages = async (socket, message) => {
    const { name, id } = socket.user;
    const t = await database.transaction();
    try {
        await Message.create({ message: message, sender: name, UserId: id });
        await t.commit();
        socket.broadcast.emit("message", { message: message, sender: name, userId: id });
    } catch (error) {
        console.error(error.message);
        await t.rollback();
    }
};

exports.getAllMessages = async (socket) => {
    const { name } = socket.user;
    try {
        const result = await Message.findAndCountAll({
            where: { GroupId: null },
        });
        const totalCount = result.count;
        const offset = Math.max(totalCount - 10, 0);
        const messages = await Message.findAll({
            where: { GroupId: null },
            offset: offset,
            limit: 10,
        });
        messages.map((message) => {
            if (message.sender == name) {
                message.sender = "You";
            }
            else {
                message.sender = message.sender;
            }
        })
        socket.broadcast.emit("user-joined", { username: socket.user.name });
        socket.emit("all-messages", messages);
    } catch (err) {
        console.log(err);
    }
}