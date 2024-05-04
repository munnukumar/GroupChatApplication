const path = require("path");
const fs = require("fs");

const rootDir = require("../util/path");

exports.getMessages = (req, res) => {
    // let message;
    // try {
    //     message = fs.readFileSync('message.txt', 'utf-8');
    // }
    // catch (err) {
    //     message = "No messages found!"
    // }
    res.sendFile(path.join(rootDir, 'views', 'message.html'));
};

const messageTxtPath = path.join(__dirname,'../','public','css', 'message.txt')

exports.postMessages = (req, res) => {
    const message = req.body.message + '\n';
    fs.appendFileSync(messageTxtPath, message);
    res.redirect('/');
}