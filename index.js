const express = require('express');
const fs = require('fs');
const Joi = require('joi');
const multer = require('multer');
const app = express();
const port = 3000;
const uploadPath = 'photos';
const upload = multer({dest: uploadPath + '/'});
app.use(express.json());

const users = [];
let lastUserId = 0;

const photos = [];
let lastPhotoId = 0;

const schema = {
    user: {
        username: Joi.string().alphanum().min(3).max(30).required(),
        password: Joi.string().min(6).max(30).required()
    },
    photo: {
        username: Joi.string().required(),
        title: Joi.string().max(50),
        description: Joi.string().max(200)
    }
};

function validate(object, type) {
    const result = Joi.validate(object, schema[type]);
    return result;
};

app.get('/api/user/', (req, res) => {
    res.send(users);
});

app.post('/api/user/', (req, res) => {
    const result = validate(req.body, 'user');
    if (result.error) {
        return res.status(400).send(result.error.details[0].message);
    }
    if (users.some(user => user.username === result.value.username)) {
        return res.status(400).send('That username has been taken');
    }
    const user = {
        ...result.value,
        id: lastUserId
    };
    lastUserId ++;
    users.push(user);
    res.send(user);
});
    
app.post('/api/photo/', upload.single('photo'), (req, res) => {
    console.log(users.map(u => u.username));
    const result = validate(req.body, 'photo');
    if (result.error) {
        return res.status(400).send(result.error.details[0].message);
    }
    if (!users.some(user => user.username === result.value.username)) {
        fs.unlink(req.file.path, (err) => {
              if (err) throw err;
              console.log(req.file.path + ' was deleted');
        });
        return res.status(400).send('Invalid username');
    }
    const photo = {
        ...result.value,
        path: req.file.path,
        id: lastPhotoId
    };
    photos.push(photo);
    lastPhotoId ++;
    res.send(photo);
});

app.get('/api/photo/', (req, res) => {
    res.send(photos);
});
app.listen(port);
