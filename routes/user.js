const express = require('express');
const Joi = require('joi');
const User = require('../models/user');
const Photo = require('../models/photo');
const Auth = require('../middlewares/auth');
const auth = Auth.auth;
const router = express.Router();

const schema = {
    forename: Joi.string(),
    surname: Joi.string(),
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

router.put('/me', auth, (req, res) => {
    req.user.forename = req.body.forename;
    req.user.surname = req.body.surname;
    let photos = Photo.getAllByUser(req.user.username);
    photos.sort((a,b) => b.date - a.date);
    let {passwordHash, apiKey, ...rest} = req.user
    res.send({
        ...rest,
        photos: photos
    });
});

router.post('/', Auth.system, (req, res) => {
    let {access_token, ...data} = req.body;
    let result = Joi.validate(data, schema);
    if (result.error) {
        return res.status(400).send({'error': result.error.details[0].message});
    }
    try {
        let user = User.create(
            req.body.username,
            req.body.password,
            req.body.forename || '',
            req.body.surname || ''
        );
        let {passwordHash, apiKey, ...rest} = user;
        res.send(rest);
    } catch (err) {
        res.status(400).send({'error': 'That username has been taken'});
    }
});

router.delete('/:username', Auth.system, (req, res) => {
    let del = User.delete(req.params.username);
    if (!del) {
        return res.status(404).send({error: 'User not found'});
    }
    res.send({status: 'deleted'});
});

router.get('/search/:term', (req, res) => {
    console.log(req.params.term);
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
