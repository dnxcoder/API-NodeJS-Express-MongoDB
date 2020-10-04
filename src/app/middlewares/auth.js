const jwt = require('jsonwebtoken');
const authConfig = require('../../config/auth.json');

module.exports = (req, res, next) => {
    
    const authHeader = req.headers.authorization;

    // Se o token não foi passado
    if(!authHeader)
    return res.status(401).send({error: 'No token provided'});

    // verificar se o token esta no formato certo
    const parts  = authHeader.split(' '); // separando o token em dois arrays pelo espaço

    if(!parts.length === 2)
    return res.status(401).send({error: 'Token error'});

    // usando a destruturação do array parts para retirar o token do array 
    const [ scheme, token ] = parts;

    if(!/^Bearer$/i.test(scheme)) // verificando se no scheme retirado do array foi encontrado a palavra Bearer
     return res.status(401).send({ error: 'Token malformatted !'});

     
     jwt.verify(token, authConfig.secret, (err, decoded) => {
         if (err) res.status(401).send({ error: 'Token invalid'});

         req.userId = decoded.id;
         return next(); // next vai para a próxima rota oferecendo o decoded.id na requisição
     });

     
     
     
};