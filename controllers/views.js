const path = require('path');

const rootDir = require('../util/path');

exports.getGroupList = async (req, res, next) => {
    res.sendFile(path.join(rootDir, "client", "groups.html"));
}

exports.getSignup = (req, res, next) => {
    res.sendFile(path.join(rootDir, 'client', 'signup.html'));
};

exports.getLogin = (req, res, next) => {
    res.sendFile(path.join(rootDir, 'client', 'login.html'));
};

exports.getMessages = (req, res, next) => {
    res.sendFile(path.join(rootDir, "client", "messages.html"));
}

exports.getContact = (req, res) => {
    res.sendFile(path.join(rootDir, 'client', 'contact.html'));
}

exports.getGroupPage = async (req, res, next) => {
    res.sendFile(path.join(rootDir, "client", "single-group.html"));
}