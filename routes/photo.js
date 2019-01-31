const express = require('express');
const Joi = require('joi');
const multer = require('multer');
const User = require('../models/user');
const Photo = require('../models/photo');
const auth = require('../middlewares/auth').auth;
const router = express.Router();
const uploadPath = 'public/photos';
const upload = multer({dest: uploadPath + '/'});

const schema = {
    description: Joi.string().max(200).allow('').required()
};

router.post('/', auth, upload.single('photo'), (req, res) => {
    let result = Joi.validate(req.body, schema);
    if (result.error) {
        return res.status(400).send({'error': result.error.details[0].message});
    }
    if (!req.file) {
        return res.status(400).send({'error': 'Photo required'});
    }
    let publicPath = '/photos/' + req.file.filename;
    try {
        let photo = Photo.create(
            req.user.username,
            req.body.description,
            req.file.path,
            publicPath
        );
        res.send(photo);
    } catch (err) {
        res.status(400).send({'error': 'Invalid image file'});
    }
});

router.put('/:id', auth, (req, res) => {
    let result = Joi.validate(req.body, schema);
    if (result.error) {
        return res.status(400).send({'error': result.error.details[0].message});
    }
    let photo = Photo.get(Number(req.params.id));
    if (!photo) {
        return res.status(404).send({'error': 'Photo not found'});
    }
    photo.description = req.body.description;
    res.send(photo);
}); 

router.get('/', (req, res) => {
    let photos = Photo.getAll();
    res.send(photos);
});

router.get('/:id', (req, res) => {
    let photo = Photo.get(Number(req.params.id));
    if (!photo) {
        return res.status(404).send({'error': 'Photo not found'});
    }
    res.send(photo);
});

router.delete('/:id', auth, (req, res) => {
    let photo = Photo.get(Number(req.params.id));
    if (!photo) {
        return res.status(404).send({'error': 'Photo not found'});
    }
    if (photo.user !== req.user.username) {
        return res.status(401).send({'error': 'You do not have permission to edit this photo'});
    }
    Photo.delete(photo.id);
    res.send({'status': 'deleted'});
});

router.post('/:id/like', auth, (req, res) => {
    let photo = Photo.get(Number(req.params.id));
    if (!photo) {
        return res.status(404).send({'error': 'Photo not found'});
    }
    if (photo.likes.indexOf(req.user.username) !== -1) {
        return res.status(400).send({'error': 'You already like this photo'});
    }
    photo.likes.push(req.user.username);
    res.send(photo);
});

router.delete('/:id/like', auth, (req, res) => {
    let photo = Photo.get(Number(req.params.id));
    if (!photo) {
        return res.status(404).send({'error': 'Photo not found'});
    }
    let i = photo.likes.indexOf(req.user.username);
    if (i === -1) {
        return res.status(400).send({'error': 'You do not already like this photo'});
    }
    photo.likes.splice(i, 1);
    res.send(photo);
});

module.exports = router;
