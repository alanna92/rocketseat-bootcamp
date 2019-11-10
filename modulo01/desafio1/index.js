const express = require('express');

const server = express();

server.use(express.json());

const projects = [
    {
        id: '1',
        title: 'Estudar',
        tasks: ['Ver as aulas']
    }, {
        id: '2',
        title: 'Trabalhar',
        tasks: []
    }
];

let countRequests = 0;

server.use((req, res, next) => {
    countRequests++;
    console.log(countRequests);
    return next();
});

function checkIfProjectExists(req, res, next) {
    const project = projects.find(p => p.id === req.params.id);

    if (!project) {
        return res.status(400).json({ error: 'Project not found' });
    }

    req.project = project;

    return next();
}

server.post('/projects', (req, res) => {
    const { id, title } = req.body;
    const newProject = {
        id,
        title,
        tasks: []
    };

    projects.push(newProject);
    return res.json(newProject);
});

server.get('/projects', (req, res) => {
    return res.json(projects);
});

server.put('/projects/:id', checkIfProjectExists, (req, res) => {
    const { title } = req.body;

    req.project.title = title;

    return res.json(req.project);
});

server.delete('/projects/:id', checkIfProjectExists, (req, res) => {
    const index = projects.indexOf(req.project);
    projects.splice(index, 1);

    return res.send();
});

server.post('/projects/:id/tasks', checkIfProjectExists, (req, res) => {
    const { title } = req.body;

    req.project.tasks.push(title);

    return res.json(req.project);
});

server.listen(3000);