const express = require('express');
const User = require('../models/user');
const auth = require('../middlewares/auth');
const router = express.Router();

router.post('/:id', auth, (req, res) => {
    let id = Number(req.params.id);
    try {
        User.follow(req.user.id, id);
    } catch (err) {
        return res.status(400).send({'error': String(err)});
    }
    res.send({'status': 'followed'});
});

router.delete('/:id', auth, (req, res) => {
    let id = Number(req.params.id);
    try {
        User.unfollow(req.user.id, id);
    } catch (err) {
        return res.status(400).send({'error': String(err)});
    }
    res.send({'status': 'unfollowed'});
});

module.exports = router;
