User = require('../models/user');

module.exports = (req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(401).send({'error': 'No authorization header specified'})
    }
    const user = User.getUserByApiKey(req.headers.authorization);
    if (user) {
        req.user = user;
        next();
    } else {
        return res.status(401).send({'error': 'Invalid api key'})
    }
};
