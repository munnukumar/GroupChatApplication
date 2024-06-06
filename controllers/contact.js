const path = require('path');

const rootDir = require('../util/path');

exports.getContact = (req, res) => {
    res.sendFile(path.join(rootDir, 'client', 'contact.html'));
}

exports.postContact = (req, res) => {
    res.sendFile(path.join(rootDir, 'client', 'success.html'));
}