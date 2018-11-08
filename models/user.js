const bcrypt = require('bcrypt');
const apiKeyChars = "QWERTYUIOPASDFGHJKLZXCVBNMqwertyuiopasdfghjklzxcvbnm1234567890";
const apiKeyLength = 32;
const users = {};
let lastId = 0;

function generateAPIKey() {
    let key = "";
    for (let i=0; i < apiKeyLength; i ++) {
        key += apiKeyChars[Math.floor(Math.random()*apiKeyChars.length)];
    }
    return key;
}

exports.create = (username, password) => {
    for (let id in users) {
        if (users[id].username === username) {
            throw "User already exists";
        }
    }
    const hash = bcrypt.hashSync(password, 10);
    const user = {
        username: username,
        passwordHash: hash,
        apiKey: generateAPIKey(),
        follows: []
    };
    let id = lastId;
    users[id] = user;
    lastId ++;
    const {passwordHash, ...rest} = user;
    return {
        id: id,
        ...rest
    };
}

exports.get = id => {
    if (users[id]) {
        const {passwordHash, apiKey, ...rest} = users[id];
        return {
            id: id,
            ...rest
        };
    }
    return null;
};

exports.getUserByApiKey = (apiKey) => {
    for (let id in users) {
        if (users[id].apiKey === apiKey) {
            return {
                id: Number(id),
                ...users[id]
            };
        }
    }
    return null;
};

exports.signIn = (username, password) => {
    const hash = bcrypt.hashSync(password, 10);
    for (let id in users) {
        if (users[id].username === username &&
            bcrypt.compareSync(password, users[id].passwordHash)) {
            return user.apiKey;
        }
    }
    return null;
};

exports.follow = (id, idToFollow) => {
    if (!users[id] || !users[idToFollow]) {
        throw 'Specified user does not exist';
    }
    if (id === idToFollow) {
        throw 'You cannot follow yourself, get a life';
    }
    if (users[id].follows.indexOf(idToFollow) !== -1) {
        throw 'You already follow that user';
    }
    users[id].follows.push(idToFollow);
    return true;
};

exports.unfollow = (id, idToUnfollow) => {
    if (!users[id] || !users[idToUnfollow]) {
        throw 'Specified user does not exist';
    }
    let i = users[id].follows.indexOf(idToFollow);
    if (i === -1) {
        throw 'You do not follow that user';
    }
    users[id].follows.splice(i,1);
    return true;
};
