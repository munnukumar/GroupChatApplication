const GroupMember = require("../models/groupmember");
const User = require("../models/user");
const Group = require("../models/groups");
const database = require("../util/database");

exports.deleteGroup = async (req, res, next) => {
    const t = await database.transaction();
    try {
        const groupId = req.params.groupId;
        const group = await Group.findByPk(groupId);
        const adminUser = await group.getUsers({
            where: { id: req.user.id },
            through: { where: { admin: true } }
        });
        if (adminUser.length == 0 || adminUser[0].id != req.user.id) {
            return res.status(401).json({ error: 'You are not admin' });
        }
        await group.destroy({ transaction: t });
        await t.commit();
        res.status(200).json({ message: 'Group deleted successfully' });
    } catch (err) {
        await t.rollback();
        console.error(err.errors[0].message);
        res.status(500).json({ error: err.errors[0].message });
    }
}

exports.editGroup = async (req, res, next) => {
    const t = await database.transaction();
    try {
        const groupId = req.params.groupId;
        const group = await Group.findByPk(groupId);
        const adminUser = await group.getUsers({
            where: { id: req.user.id },
            through: { where: { admin: true } }
        });
        if (adminUser.length == 0 || adminUser[0].id != req.user.id) {
            return res.status(401).json({ error: 'You are not admin' });
        }
        group.name = req.body.name;
        const members = req.body.members;
        console.log("5555", members)
        for(let member of members){
            const user = await User.findOne({ where: { email: member } });
            if (!user) {
                await t.rollback();
                return res.status(500).json({ error: `User with email ${member} not found` });
            }
            await group.addUser(user, { transaction: t });
        }
        await group.save({ transaction: t });
        await t.commit();
        res.status(200).json({ message: 'Group edited successfully' });
    } catch (err) {
        await t.rollback();
        console.error(err.message);
        res.status(500).json({ error: err.message });
    }
}


exports.deleteMember = async (req, res, next) => {
    try {
        const groupId = req.params.groupId;
        const userId = req.params.userId;
        const group = await Group.findByPk(groupId);
        const adminUser = await group.getUsers({
            where: { id: req.user.id },
            through: { where: { admin: true } }
        });
        if (adminUser.length == 0 || adminUser[0].id != req.user.id) {
            return res.status(401).json({ error: 'You are not admin' });
        }
        if (userId == req.user.id) {
            return res.status(500).json({ error: `You can't leave group as you are creator` });
        }
        await GroupMember.destroy({ where: { groupId: groupId, userId: userId } });
        res.status(200).json({ message: 'Member deleted successfully' });
    } catch (err) {
        console.error(err.errors[0].message);
        res.status(500).json({ error: err.errors[0].message });
    }
}

exports.makeAdmin = async (req, res, next) => {
    try {
        const groupId = req.params.groupId;
        const userId = req.params.userId;
        const group = await Group.findByPk(groupId);
        const adminUser = await group.getUsers({
            where: { id: req.user.id },
            through: { where: { admin: true } }
        });
        if (adminUser.length == 0 || adminUser[0].id != req.user.id) {
            return res.status(401).json({ error: 'You are not admin' });
        }
        await GroupMember.update({ admin: true }, { where: { groupId: groupId, userId: userId } });
        res.status(200).json({ message: 'Member made admin successfully' });
    } catch (err) {
        console.error(err.errors[0].message);
        res.status(500).json({ error: err.errors[0].message });
    }
}