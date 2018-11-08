const express = require('express');
const Joi = require('joi');
const User = require('../models/user');
const Photo = require('../models/photo');
const auth = require('../middlewares/auth');
const router = express.Router();

const schema = {
    username: Joi.string().alphanum().min(3).max(30).required(),
    password: Joi.string().min(6).max(30).required()
}

router.get('/:username', (req, res) => {
    const user = User.get(req.params.username);
    if (!user) {
        return res.status(400).send({'error':'User not found'});
    }
    let photos = Photo.getAllByUser(req.params.username);
    let expand;
    if (req.query.expand) {
        expand = req.query.expand.split(',');
    }
    if (!expand || expand.indexOf('photos') === -1) {
        photos = photos.map(photo => photo.id);
    }
    res.send({
        ...user,
        photos: photos
    });
});

router.post('/', (req, res) => {
    const result = Joi.validate(req.body, schema);
    if (result.error) {
        return res.status(400).send({'error': result.error.details[0].message});
    }
    try {
        const user = User.create(req.body.username, req.body.password);
        res.send(user);
    } catch (err) {
        res.status(400).send({'error': 'That username has been taken'});
    }
});

module.exports = router;
