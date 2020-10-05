const mongoose = require('../../database/connection');


const ProjectSchema = new mongoose.Schema({
    title:{
        type:String,
        require:true
    },
    description: {
        type:String,
        require: true,
    },
    user:{
        type:mongoose.Schema.Types.ObjectId, // colocando o ID do usuario como se fosse uma chave estrangeira.
        ref: 'User', // criando uma referencia para o schema User
        require:true,
    },
    tasks:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task',
    }],
    createdAt:{
        type:Date,
        default: Date.now
    }
});

const Project = mongoose.model('Project', ProjectSchema);

module.exports = Project;