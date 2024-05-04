const path = require("path");
const fs = require("fs");
const Message = require("../models/message");
const rootDir = require("../util/path");

exports.getMessages = (req, res) => {
    res.sendFile(path.join(rootDir, 'views', 'message.html'));
};

const messageTxtPath = path.join(__dirname,'../','public','css', 'message.txt')

exports.postMessages = (req, res) => {
    const message = new Message(req.body.message);
    message.save();
    res.redirect('/');
    // const message = req.body.message + '\n';
    // fs.appendFileSync('message.txt', message);
}