const bcrypt = require('bcrypt');
const ss = require('string-similarity');
const apiKeyChars = "QWERTYUIOPASDFGHJKLZXCVBNMqwertyuiopasdfghjklzxcvbnm1234567890";
const apiKeyLength = 32;
let users = [];

function generateAPIKey() {
    let key = "";
    for (let i=0; i < apiKeyLength; i ++) {
        key += apiKeyChars[Math.floor(Math.random()*apiKeyChars.length)];
    }
    return key;
}

exports.create = (username, password, forename, surname) => {
    if (exports.get(username)) {
        throw "User already exists";
    }
    let hash = bcrypt.hashSync(password, 10);
    let user = {
        username: username,
        forename: forename,
        surname: surname,
        passwordHash: hash,
        apiKey: generateAPIKey(),
        follows: []
    };
    users.push(user);
    //const {passwordHash, ...rest} = user;
    //return rest;
    return user;
}

exports.delete = username => {
    for (let i=0; i<users.length; i++) {
        if (users[i].username === username) {
            users.splice(i,1);
            return true;
        }
    }
    return false;
};

exports.get = username => {
    for (let user of users) {
        if (user.username === username) {
            //const {passwordHash, apiKey, ...rest} = user;
            //return rest;
            return user;
        }
    }
    return null;
};

exports.getAll = () => {
    return users.map(user => {
        let {passwordHash, apiKey, follows, ...rest} = user;
        return rest;
    });
};

exports.getUserByApiKey = (apiKey) => {
    for (let user of users) {
        if (user.apiKey === apiKey) {
            return user;
        }
    }
    return null;
};

exports.signIn = (username, password) => {
    let hash = bcrypt.hashSync(password, 10);
    for (let user of users) {
        if (user.username === username &&
            bcrypt.compareSync(password, user.passwordHash)) {
            return user.apiKey;
        }
    }
    return null;
};

exports.search = (term, limit) => {
    let ranks = {};
    let usernames = []
    for(user of users) {
        let rank = ss.compareTwoStrings(term, user.username);
        if (rank > 0.3) {
            usernames.push(user.username);
            ranks[user.username] = rank
        }
    }
    usernames.sort((a,b) => ranks[b] - ranks[a]);
    return usernames.slice(0, limit);
};
