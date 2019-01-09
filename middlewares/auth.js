User = require('../models/user');

module.exports.system = (req, res, next) => {
    console.log(req.body);
    if (req.body.access_token === 'concertina') {
        next();
    } else {
        res.status(403).send({'error': 'No access_token field provided'});
    }
};

module.exports.auth = (req, res, next) => {
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
