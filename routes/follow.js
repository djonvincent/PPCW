const express = require('express');
const User = require('../models/user');
const auth = require('../middlewares/auth').auth;
const router = express.Router();

router.post('/:username', auth, (req, res) => {
    if (!User.get(req.params.username)) {
        return res.status(400).send({'error': 'Specified user does not exist'});
    }
    if (req.params.username === req.user.username) {
        return res.status(400).send({'error': 'You cannot follow yourself'});
    }
    if (req.user.follows.indexOf(req.params.username) !== -1) {
        return res.status(400).send({'error': 'You already follow that user'});
    }
    req.user.follows.push(req.params.username);
    res.send({'status': 'followed'});
});

router.delete('/:username', auth, (req, res) => {
    if (!User.get(req.params.username)) {
        return res.status(400).send({'error': 'Specified user does not exist'});
    }
    let i = req.user.follows.indexOf(req.params.username);
    if (i == -1) {
        return res.status(400).send({'error': "You don't follow that user"});
    }
    req.user.follows.splice(i,1);
    res.send({'status': 'unfollowed'});
});

module.exports = router;
