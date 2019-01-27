const express = require('express');
const Joi = require('joi');
const User = require('../models/user');
const Photo = require('../models/photo');
const Auth = require('../middlewares/auth');
const auth = Auth.auth;
const router = express.Router();

const schema = {
    username: Joi.string().alphanum().min(3).max(30).required(),
    password: Joi.string().min(6).max(30).required()
}

router.get('/', (req, res) => {
    res.send(User.getAll());
});

router.get('/me', auth, (req, res) => {
    let photos = Photo.getAllByUser(req.user.username);
    photos.sort((a,b) => b.date - a.date);
    let expand;
    if (req.query.expand) {
        expand = req.query.expand.split(',');
    }
    if (!expand || expand.indexOf('photos') === -1) {
        photos = photos.map(photo => photo.id);
    }
    let {passwordHash, apiKey, ...rest} = req.user
    res.send({
        ...rest,
        photos: photos
    });
});

router.get('/:username', (req, res) => {
    let user = User.get(req.params.username);
    if (!user) {
        return res.status(404).send({'error':'User not found'});
    }
    let photos = Photo.getAllByUser(req.params.username);
    photos.sort((a,b) => b.date - a.date);
    let expand;
    if (req.query.expand) {
        expand = req.query.expand.split(',');
    }
    if (!expand || expand.indexOf('photos') === -1) {
        photos = photos.map(photo => photo.id);
    }
    let {passwordHash, apiKey, ...rest} = user
    res.send({
        ...rest,
        photos: photos
    });
});

router.get('/:username/photos', auth, (req, res) => {
    let user = User.get(req.params.username);
    if (!user) {
        return res.status(404).send({'error': 'User not found'});
    }
    if ([...req.user.follows, req.user.username].indexOf(req.params.username) === -1) {
        return res.status(401).send({'error': 'You do not permission to view this'});
    }
    res.send(Photo.getAllByUser(user.username));
});

router.post('/', Auth.system, (req, res) => {
    console.log(req.body);
    let result = Joi.validate(req.body, schema);
    if (result.error) {
        return res.status(400).send({'error': result.error.details[0].message});
    }
    try {
        let user = User.create(req.body.username, req.body.password);
        let {passwordHash, apiKey, ...rest} = user;
        res.send(rest);
    } catch (err) {
        res.status(400).send({'error': 'That username has been taken'});
    }
});

router.get('/search/:term', (req, res) => {
    let limit = 10;
    if (req.query.limit) {
        let customLimit = parseInt(req.query.limit);
        if (!customLimit.isNan()) {
            limit = customLimit;
        }
    }
    res.send(User.search(req.params.term, limit));
});

module.exports = router;
