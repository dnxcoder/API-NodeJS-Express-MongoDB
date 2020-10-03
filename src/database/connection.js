const mongoose = require('mongoose');


mongoose.connect('mongodb+srv://dnxcoder:qbMB0M8ZYYve23ki@cluster0.bsddk.mongodb.net/apinodejs?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true});

module.exports = mongoose;