const path = require('path');

const rootDir = require('../util/path');

exports.error404 = (req, res, next) => {
    res.status(404).sendFile(path.join(rootDir, 'client', '404.html'));
};