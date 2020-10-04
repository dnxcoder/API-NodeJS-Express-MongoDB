const fs = require('fs');
const path = require('path');

module.exports = app => {

    fs
    .readdirSync(__dirname)
    .filter(file => ((file.indexOf('.')) !== 0 && (file !== "index.js"))) //retorne todos os arquivos desta pasta controlers que nao comecem com ponto "." e  todos os arquivos que não sejam index.
    .forEach(file => require(path.resolve(__dirname, file))(app)); // percorrer todos esses arquivos e dar um require neles passando o app para cada um.


}