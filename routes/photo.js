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
    title: Joi.string().max(50),
    description: Joi.string().max(200).allow('')
};

router.post('/', auth, upload.single('photo'), (req, res) => {
    let result = Joi.validate(req.body, schema);
    if (result.error) {
        return res.status(400).send({'error': result.error.details[0].message});
    }
    if (!req.file) {
        return res.status(400).send({'error': 'Photo required'});
    }
    let path = '/photos/' + req.file.filename;
    let photo = Photo.create(req.user.username, req.body.description, path);
    res.send(photo);
});

router.get('/:id', auth, (req, res) => {
    let photo = Photo.get(Number(req.params.id));
    if (!photo) {
        return res.status(400).send({'error': 'Photo not found'});
    }
    if (photo.user !== req.user.username) {
        return res.status(401).send({'error': 'You do not have permission to view this photo'});
    }
    if (!photo) {
        return res.status(400).send({'error': 'Photo not found'});
    }
    res.send(photo);
});

module.exports = router;
