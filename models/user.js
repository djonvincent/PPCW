const bcrypt = require('bcrypt');
const apiKeyChars = "QWERTYUIOPASDFGHJKLZXCVBNMqwertyuiopasdfghjklzxcvbnm1234567890";
const apiKeyLength = 32;
const users = [];

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
    const hash = bcrypt.hashSync(password, 10);
    const user = {
        username: username,
        forename: forename,
        surname: surname,
        passwordHash: hash,
        apiKey: generateAPIKey(),
        follows: []
    };
    users.push(user);
    const {passwordHash, ...rest} = user;
    return rest;
}

exports.get = username => {
    for (let user of users) {
        if (user.username === username) {
            const {passwordHash, apiKey, ...rest} = user;
            return rest;
        }
    }
    return null;
};

exports.getAll = () => {
    return users.map(user => {
        const {passwordHash, apiKey, follows, ...rest} = user;
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
    const hash = bcrypt.hashSync(password, 10);
    for (let user of users) {
        if (user.username === username &&
            bcrypt.compareSync(password, user.passwordHash)) {
            return user.apiKey;
        }
    }
    return null;
};
