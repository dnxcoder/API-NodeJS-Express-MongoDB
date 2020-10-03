const mongoose = require('../database/connection'); //importing mongoose connect to MongoDB
const bcrypt= require('bcryptjs');


const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
    },
    email:{
        type: String,
        unique:true,
        required: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        select: false, // for it do not come with the search
    },
    createdAt:{
        type: Date,
        default: Date.now,
    },
});

UserSchema.pre('save', encryptPassword) //antes de salvar

async function encryptPassword(next){
     const hash = await bcrypt.hash(this.password, 10);
     this.password = hash;

     next();
 }

const User = mongoose.model('User', UserSchema);

module.exports = User;