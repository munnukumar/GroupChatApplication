const path = require("path");

const rootDir = require("../util/path");
const Message = require("../models/message");
const GroupMember = require("../models/groupmember");
const User = require("../models/user");
const Group = require("../models/groups");
const database = require("../util/database");
const { chown } = require("fs");

exports.getGroupList = async (req, res, next) => {
    res.sendFile(path.join(rootDir, "client", "groups.html"));
}

exports.getAllGroups = async (req, res, next) => {
    try {
        const UserId = req.user.id;
        const user = await User.findByPk(UserId);
        const groupMember = await user.getGroups();
        res.status(200).json({ message: groupMember });
    }
    catch (err) {
        console.error(err.errors[0].message);
        res.status(500).json({ error: err.errors[0].message });
    }
}

exports.getGroupPage = async (req, res, next) => {
    // console.log("&&&&&", req)
    res.sendFile(path.join(rootDir, "client", "single-group.html"));
}

exports.getGroupMessages = async (req, res, next) => {
    try {
        const groupId = req.params.groupId;
        const userId = req.user.id;
        const groupMember = await GroupMember.findOne({ where: { groupId: groupId, userId: userId } });
        if (!groupMember) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const messages = await Message.findAll({ where: { groupId: groupId } });
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
        console.error(err);
        res.status(500).json({ error: err });
    }
}

exports.getGroupMembers = async (req, res, next) => {
    try {
        const groupId = req.params.groupId;
        const userId = req.user.id;
        const groupMember = await GroupMember.findOne({ where: { groupId: groupId, userId: userId } });
        if (!groupMember) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const group = await Group.findByPk(groupId);
        const memberList = await group.getUsers();
        const names = memberList.map(user => {
            if (req.user.name == user.name) {
                return `You`;
            }
            else {
                return user.name;
            }
        });
        res.status(200).json({ message: names });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: err });
    }
}

exports.sendGroupMessage = async (req, res, next) => {
    const t = await database.transaction();
    try {
        const groupId = req.params.groupId;
        const userId = req.user.id;
        const groupMember = await GroupMember.findOne({ where: { groupId: groupId, userId: userId } });
        if (!groupMember) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        await Message.create({
            sender: req.user.name,
            message: req.body.message,
            GroupId: groupId,
            UserId: userId
        });
        await t.commit();
        res.status(200).json({ message: 'Message sent successfully' });
    }
    catch (err) {
        console.error(err.errors[0].message);
        await t.rollback();
        res.status(500).json({ error: err.errors[0].message });
    }
}

exports.createGroup = async (req, res, next) => {
    const t = await database.transaction();
    try {
        const group = await Group.create({
            name: req.body.name,
            adminId: req.user.id
        }, { transaction: t });
        await group.addUser(req.user, { transaction: t });
        for (const member of req.body.members) {
            const user = await User.findOne({ where: { email: member } });
            if (!user) {
                await t.rollback();
                return res.status(500).json({ error: `User with emails not found` });
            }
            console.log("6666", member)
            await group.addUser(user, { transaction: t });
        }
        await t.commit();
        res.status(200).json({ message: 'Group created successfully' });
    } catch (err) {
        console.error(err.errors[0].message);
        await t.rollback();
        res.status(500).json({ error: err.errors[0].message });
    }
}