const express = require('express');
const fs = require('fs');
const Joi = require('joi');
const multer = require('multer');
const User = require('./models/user');
const Photo = require('./models/photo');
const auth = require('./middlewares/auth').auth;
const app = express();
const server = require('http').createServer(app);
const port = 3000;
const uploadPath = 'public/photos';
const upload = multer({dest: uploadPath + '/'});
const path = require('path');

app.use(express.json());
app.use(express.static('public'));
app.use('/api/people', require('./routes/user'));
app.use('/api/photo', require('./routes/photo'));
app.use('/api/follow', require('./routes/follow'));

app.get('/api/login', (req, res) => {
    if (!req.headers.authorization) {
        return res.status(401).send();
    }
    if (req.headers.authorization.indexOf('Basic ') === -1) {
        return res.status(401).send();
    }
    let token = req.headers.authorization.substring(6);
    let plainToken = Buffer.from(token, 'base64').toString();
    let colonIndex = plainToken.indexOf(':');
    let username = plainToken.substring(0, colonIndex);
    let password = plainToken.substring(colonIndex+1);
    let apiKey = User.signIn(username, password);
    if (!apiKey) {
        return res.status(401).send({'error': 'Username/password not found'});
    }
    res.send({key: apiKey, username: username});
});

app.get('/api/feed', auth, (req, res) => {
    let dateFrom = req.query.dateFrom || 0;
    let photos = Photo.getFeed(req.user.follows, dateFrom);
    res.send(photos);
});

app.get(['/', '/login', '/upload', '/profile/:username', '/photo/:id'], (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
});

if (!fs.existsSync('public/photos')) {
    fs.mkdirSync('public/photos');
}

let delia = User.create(
    'doctorwhocomposer',
    'password',
    'Delia',
    'Derbyshire'
)
delia.apiKey = 'concertina';
delia.follows.push('watchcollector');

User.create(
    'watchcollector',
    'password',
    'Dion',
    'HS'
);

Photo.create(
    'watchcollector',
    'Black Bay Fifty-Eight',
    'public/images/bb58.jpg',
    '/images/bb58.jpg'
);

setTimeout(() => {
    Photo.create(
        'watchcollector',
        'Omega Seamaster',
        'public/images/smp.jpg',
        '/images/smp.jpg'
    );
}, 10);

server.listen(port);

module.exports = server;
