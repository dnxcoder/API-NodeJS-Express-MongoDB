const path = require('path');
const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');



const { host, port, user, pass } = require('../config/mail.json');

const transport = nodemailer.createTransport({
    host: host,
    port: port,
    auth: {
        user: user,
        pass: pass
    }
});

transport.use('compile', hbs({
    viewEngine: {
        defaultLayout: undefined,
        partialsDir: path.resolve('./src/resources/mail/')// partindo da raiz absoluta do projeto
    },
    viewPath: path.resolve('./src/resources/mail/'), // partindo da raiz absoluta do projeto
    extName: '.html',
}));


module.exports = transport;