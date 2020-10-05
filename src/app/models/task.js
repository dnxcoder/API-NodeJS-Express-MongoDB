const mongoose = require('../../database/connection');


const TaskSchema = new mongoose.Schema({
    title:{
        type:String,
        require:true
    },
    project:{
        type: mongoose.Schema.Types.ObjectId, // colocando o ID de um Project como se fosse uma chave estrangeira.
        ref:'Project',
        require:true
    },
    assignedTo:{
        type:mongoose.Schema.Types.ObjectId, // colocando o ID do usuario como se fosse uma chave estrangeira.
        ref: 'User', // criando uma referencia para o schema User
        require:true,
    },
    completed:{
        type: Boolean,
        require: true,
        default:false
    },
    createdAt:{
        type:Date,
        default: Date.now
    }
});

const Project = mongoose.model('Task', TaskSchema);

module.exports = Project;