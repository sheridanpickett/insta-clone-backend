const express = require('express');
const { client } = require('../postgres')
const Joi = require('joi');
const { v4: uuid } = require('uuid');
const router = express.Router();

const validateNewUser = (email, fullName, username, password) => {
    let errorMessages = [];
    let details = {
        email: {error: false, accepted: false},
        fullName: {error: false, accepted: false},
        username: {error: false, accepted: false},
        password: {error: false, accepted: false}
    }
    const userSchema = Joi.object({
        email: Joi.string().email().max(250).required(),
        fullName: Joi.string().min(1).max(65).required(),
        username: Joi.string().min(6).max(65).required(),
        password: Joi.string().min(6).required()
    })
    const {error} = userSchema.validate({email, fullName, username, password}, {abortEarly: false});
    error && error.details.map(err=>{
        errorMessages.push(err.message);
        details[err.context.label]['error'] = true;
    })
    let passed = false;
    if(errorMessages.length < 1) {
        passed = true;
    }
    //look up email in firebase
    //look up username in firebase
    return {errorMessages, details, passed};
}

router.post('/validate_signup', (req, res) => {
    const { email, fullName, username, password} = req.body;
    const result = validateNewUser(email, fullName, username, password);
    return res.send(result);
})

router.post('/signup', async (req, res) => {
    const { uid, fullName, username } = req.body;
    try {
        const userData = await client.query(`INSERT INTO users (uid, full_name, username) VALUES ('${uid}', '${fullName}', '${username}') RETURNING *`);
        return res.send(userData.rows[0]);
    } catch(error) {
        return res.sendStatus(500);
    }
})

router.get('/user_data', async (req, res) => {
    try {
        const uid = req.query.uid;
        let userData = await client.query(`SELECT * FROM users WHERE uid = '${uid}'`);
        userData = userData.rows[0];
        delete userData.uid;
        return res.send(userData);
    } catch(error) {
        res.sendStatus(500);
    }
})

module.exports = router;