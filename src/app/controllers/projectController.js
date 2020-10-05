const express = require('express');
const authMiddleware = require('../middlewares/auth');

const Project = require('../models/project');
const Task = require('../models/task');


const router = express.Router();

router.use(authMiddleware); //Todas as rotas terão que passar pelo middleware authMiddleware para obterem autentificação

router.get('/', async (req, res) => {
    try {
        const projects = await Project.find().populate(['user', 'tasks']);
        // Usando o populate traz todas as informações do usuário que esta "relacionado" ao projeto
        // Usando o populate com as taks traz as informações das tasks que estao relacionadas ao projeto
        return res.send({ projects });
    } catch (err) {
        return res.status(400).send({ error: 'Error loading projects', err });
    }
});


router.get('/:projectId', async (req, res) => {

    try {
        const project = await Project.findById(req.params.projectId).populate(['user', 'tasks']);

        return res.send({ project });
    } catch (err) {
        res.status(400).send({ error: 'Error loading projects', err });
    }
});

router.post('/', async (req, res) => {

    try {

        const { title, description, tasks } = req.body;


        const project = await Project.create({ title, description, user: req.userId }); // O req.userId esta vindo do middleware de autenticação authMiddleware.

        await Promise.all(tasks.map(async task => { // Promisse.all diz para esperar todas essas tarefas internas serem completadas para assim depois realizar a proxima tarefa.
            const projectTask = new Task({ ...task, project: project._id }); // ler abaixo
            /* Aqui estamos pegando as tasks e colocando no Schema Task com o ID do projeto
               desse jeito conseguimos fazer relação entre o model Projects e Tasks fazendo assim uma relação
            */
            await projectTask.save(); // salvando no Model Task as tasks com o ID do projeto
            project.tasks.push(projectTask); // Adicionando tasks no model Project.             

        }));

        await project.save();

        return res.send({ project });
    } catch (err) {
        console.log(err);
        return res.status(400).send({ error: 'Error creating new project' });
    }
});

router.put('/:projectId', async (req, res) => {

    try {

        const { title, description, tasks } = req.body;


        const project = await Project.findByIdAndUpdate(req.params.projectId,
             { title, description, }, { new: true }
             ); 
        // O req.userId esta vindo do middleware de autenticação authMiddleware.
        // o objeto {new: true} é usado para mostrar o novo valor alterado quando for retornado na mensagem

        project.tasks = [];
        await Task.remove({project: project._id});


        await Promise.all(tasks.map(async task => { // Promisse.all diz para esperar todas essas tarefas internas serem completadas para assim depois realizar a proxima tarefa.
            const projectTask = new Task({ ...task, project: project._id }); // ler abaixo
            /* Aqui estamos pegando as tasks e colocando no Schema Task com o ID do projeto
               desse jeito conseguimos fazer relação entre o model Projects e Tasks fazendo assim uma relação
            */
            await projectTask.save(); // salvando no Model Task as tasks com o ID do projeto
            project.tasks.push(projectTask); // Adicionando tasks no model Project.             

        }));

        await project.save();

        return res.send({ project });
    } catch (err) {
        console.log(err);
        return res.status(400).send({ error: 'Error updating new project' });
    }



})

router.delete('/:projectId', async (req, res) => {

    try {
        await Project.findByIdAndDelete(req.params.projectId);

        res.send({ message: 'Project deleted' })
    } catch (err) {
        res.status(400).send({ error: 'not abble to delete user' });
    }
})

module.exports = (app) => app.use('/projects', router);