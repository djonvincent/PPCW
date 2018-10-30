const express = require('express');
const Joi = require('joi');
const app = express();
const port = 3000;

app.use(express.json());

const users = [];
let lastUserId = 0;

function validateUser(user) {
    const schema = {
        username: Joi.string().alphanum().min(3).max(30).required().invalid(
            users.map(u => u.username)
        ),
        password: Joi.string().min(6).max(30).required()
    };
    const result = Joi.validate(user, schema);
    return result;
};

app.get('/api/user/', (req, res) => {
    res.send(users);
});

app.post('/api/user/', (req, res) => {
    const result = validateUser(req.body);
    console.log(result);
    if (result.error) {
        return res.status(400).send(result.error.details[0].message
        );
    }
    const user = result.value;
    lastUserId ++;
    user.id  = lastUserId;
    users.push(user);
    res.send(user);
});
    

app.listen(port);
