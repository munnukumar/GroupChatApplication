const path = require('path');

const rootDir = require('../util/path');

exports.postContact = (req, res) => {
    res.sendFile(path.join(rootDir, 'client', 'success.html'));
}