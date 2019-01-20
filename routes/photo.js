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
    let photo = Photo.create(
        req.user.username,
        req.body.description,
        req.file.path,
        publicPath
    );
    res.send(photo);
});

router.put('/:id', auth, (req, res) => {
    let result = Joi.validate(req.body, schema);
    if (result.error) {
        return res.status(400).send({'error': result.error.details[0].message});
    }
    let photo = Photo.get(Number(req.params.id));
    photo.description = req.body.description;
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
    res.send(photo);
});

router.delete('/:id', auth, (req, res) => {
    let photo = Photo.get(Number(req.params.id));
    if (!photo) {
        return res.status(400).send({'error': 'Photo not found'});
    }
    if (photo.user !== req.user.username) {
        return res.status(401).send({'error': 'You do not have permission to view this photo'});
    }
    Photo.delete(photo.id);
    res.send({'status': 'deleted'});
});

module.exports = router;
