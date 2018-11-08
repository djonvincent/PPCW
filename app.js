const express = require('express');
const fs = require('fs');
const Joi = require('joi');
const multer = require('multer');
const User = require('./models/user');
const Photo = require('./models/photo');
const auth = require('./middlewares/auth');
const app = express();
const port = 3000;
const uploadPath = 'photos';
const upload = multer({dest: uploadPath + '/'});

app.use(express.json());
app.use('/api/user', require('./routes/user'));
app.use('/api/photo', require('./routes/photo'));
app.use('/api/follow', require('./routes/follow'));

app.get('/api/login/', (req, res) => {
    if (!req.headers.authorization) {
        return res.status(401).send();
    }
    if (req.headers.authorization.indexOf('Basic ') === -1) {
        return res.status(401).send();
    }
    const token = req.headers.authorization.substring(6);
    const plainToken = Buffer.from(token, 'base64').toString();
    const colonIndex = plainToken.indexOf(':');
    const username = plainToken.substring(0, colonIndex);
    const password = plainToken.substring(colonIndex+1);
    const apiKey = User.signIn(username, password);

    res.send({'key': apiKey});
});

app.get('/api/feed', auth, (req, res) => {
    let dateFrom = req.query.dateFrom || 0;
    let photos = Photo.getAllByUsers(req.user.follows, dateFrom);
    res.send(photos);
});

if (!fs.existsSync('photos')) {
    fs.mkdirSync('photos');
}

app.listen(port);
