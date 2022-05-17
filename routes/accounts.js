const express = require('express');
const bodyParser = require('body-parser');
const { client } = require('../postgres')
const crypto = require('crypto');const argon2 = require('argon2');
const Joi = require('joi');

const hasher = async () => {
    try {
      const hash = await argon2.hash("password1223");
      console.log(hash);
    } catch (err) {
      //...
    }
}

const router = express.Router();
const jsonParser = bodyParser.json();


router.post('/create_user', jsonParser, async (req, res) => {
    const {wasDryRun, email, fullName, username, password} = req.body;
    const schema = Joi.object({
        email: Joi.string().email().max(250).required(),
        name: Joi.string().min(1).max(65).required(),
        username: Joi.string().min(6).max(65).required(),
        password: Joi.string().min(6).required()
    })
    const {error} = schema.validate({email, name: fullName, username, password}, {abortEarly: false});
    if(error) {
        const errors = error.details.map(err=>({
            message: err.message,
            label: err.context.label
        }))
        res.send({
            errors
        });
    } else {
        //if successful, check db if email, username exists
        const usernameExistsQuery = await client.query(`SELECT id FROM users WHERE username = '${username}'`);
        const emailExistsQuery = await client.query(`SELECT id FROM users WHERE email = '${email}'`);
        let errors = [];
        if(usernameExistsQuery.rowCount > 0) {
            errors.push({label: 'username', message: 'a user with that username already exists'});
        }
        if(emailExistsQuery.rowCount > 0) {
            errors.push({label: 'email', message: 'a user with that email already exists'});
        }
        res.statusCode(201);
        res.send({errors});
    }
})

module.exports = router;