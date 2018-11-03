const bcrypt = require('bcrypt');
const users = [];

exports.create = (username, password) => {
    if (exports.get(username)) {
        throw "User already exists";
    }
    const hash = bcrypt.hashSync(password, 10);
    const user = {
        username: username,
        passwordHash: hash,
        follows: []
    };
    users.push(user);
    const {passwordHash, ...rest} = user;
    return rest;
}

exports.get = (username) => {
    for (let user of users) {
        if (user.username === username) {
            const {passwordHash, ...rest} = user;
            return rest;
        }
    }
    return null;
};

