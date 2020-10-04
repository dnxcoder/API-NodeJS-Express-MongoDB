const express = require('express');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const mailer = require('../../modules/mailer');



const authConfig = require('../../config/auth.json');

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

router.post('/forgot_password', async (req, res) => {

    const { email } = req.body;


    try {

        const user = await User.findOne({ email });

        if (!user)
            return res.status(400).send({ error: 'user not found !' });

        const token = crypto.randomBytes(20).toString('hex');

        const now = new Date();
        now.setHours(now.getHours() + 1); // pegando a hora de agora e acrescentando mais uma hora

        await User.findByIdAndUpdate(user.id, {
            '$set': {
                passwordResetToken: token,
                passwordResetExpires: now,

            },
        },
            { new: true, useFindAndModify: false }
        );

        console.log(token, now);

        mailer.sendMail({
            to: email,
            from: 'dnxcoder@gmail.com',
            template: 'auth/forgot_password',
            context: { token } // repassando a variavel token para dentro do template html            
        }, (err) => {
            if (err) return res.status(400).send({ error: 'Cannot send forgot password email ' + err });

            res.send();
        })
    } catch (err) {
        res.status(400).send({ error: 'Erro on forgot password, try again ' + err })
    }
});

router.post('/reset_password', async (req, res) => {

    const { email, token, password } = req.body;

    try {
        const user = await User.findOne({ email }).select('+passwordResetToken passwordResetExpires');

        if(!user) return res.status(401).send('User does not exist');

        if(token !== user.passwordResetToken)
        return res.status(400).send({ error: 'Token invalid' });

        const now = new Date();

        if(now > user.passwordResetExpires)
        return res.status(400).send({error: 'Token expired, please generate a new one'});

        user.password = password;
        user.passwordResetExpires= null;
        user.passwordResetToken = null;

        await user.save();

        res.send(); 

    } catch (error) {
        res.status(400).send({ error: 'Cannot reset password, try again' });
    }
});

module.exports = (app) => app.use('/auth', router); // usando o app que veio do index.js todas as rotas do router irão ser prefixadas pela rota auth