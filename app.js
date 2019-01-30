const express = require('express');
const fs = require('fs');
const Joi = require('joi');
const multer = require('multer');
const User = require('./models/user');
const Photo = require('./models/photo');
const auth = require('./middlewares/auth').auth;
const app = express();
const uploadPath = 'public/photos';
const upload = multer({dest: uploadPath + '/'});
const path = require('path');

app.use(express.json());
app.use('/people', require('./routes/user'));
app.use('/photo', require('./routes/photo'));
app.use('/follow', require('./routes/follow'));

app.get('/app/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/login.html'));
});

app.get('/app/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.get(['/', '/app'], (req, res) => {
    res.redirect('/app/');
});

app.use(express.static('public'));

app.get('/login', (req, res) => {
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

app.get('/feed', auth, (req, res) => {
    let dateFrom = req.query.dateFrom || 0;
    let photos = Photo.getFeed(req.user.follows, dateFrom);
    res.send(photos);
});

if (!fs.existsSync('public/photos')) {
    fs.mkdirSync('public/photos');
}

User.create(
    'doctorwhocomposer',
    'password',
    'Delia',
    'Derbyshire'
)

User.create(
    'watchcollector',
    'password',
    'Dion',
    'HS'
);

module.exports = app;
