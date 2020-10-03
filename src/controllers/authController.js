const express = require('express');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

const authConfig = require('../config/auth.json');

const User = require('../models/user');

const router = express.Router();

function generateToken(params = {}) {

    return jwt.sign(params, authConfig.secret, {
        expiresIn: 86400
    })
}


router.get('/ops', (req, res) => {

    res.send('Connect to API-NodeJS-Express-Mongodb')
})

router.post('/register', async (req, res) => {

    const { email } = req.body;

    try {

        if (await User.findOne({ email }))
            return res.status(400).send({ error: 'User already exists' });

        const user = await User.create(req.body);

        user.password = null;
        return res.send({
            user,
            token: generateToken({ id: user.id })
        });
    } catch {
        (error) => res.status(401).send('Bad requisition')
    }
});

router.post('/authenticate', async (req, res) => {

    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
        return res.status(400).send({ error: 'User not found' })
    }

    if (!await bcryptjs.compare(password, user.password)) {
        return res.status(400).send({ error: 'Invalid password !' });
    }

    user.password = null;


    //generating JWT


    res.send({
        user,
        token: generateToken({ id: user.id })
    });
});

module.exports = (app) => app.use('/auth', router); // usando o app que veio do index.js todas as rotas do router irão ser prefixadas pela rota auth