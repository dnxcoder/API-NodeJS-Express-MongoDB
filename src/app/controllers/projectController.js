const express  = require('express');
const authMiddleware = require('../middlewares/auth');


const router = express.Router();

router.use(authMiddleware); //Todas as rotas terão que passar pelo middleware authMiddleware para obterem autentificação

router.get('/', (req,res)=> {
    res.send({msg: req.userId});
});

module.exports = (app) => app.use('/projects', router);