const express = require('express');
const bodyParser = require('body-parser');
//const mongodbConnection = require('./database/connection');

const app = express();

app.use(bodyParser.json()); // utilizar json na minha aplicação
app.use(bodyParser.urlencoded({ extended: false})); // permite capturar dados nas urls

require('./controllers/authController')(app); // repassando para o controller o app como como parametro para a funcao no authController 
require('./controllers/projectController')(app); 

//app.get('/', (req,res)=> res.send('welcome to the first page of the application'))


app.listen(3001);