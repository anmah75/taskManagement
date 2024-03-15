const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

let tasks = [];
let nextTaskId = 1;
let users = {};

app.use(bodyParser.json());

// User authentication middleware
function authenticateUser(req, res, next) {
    const userId = req.headers['user-id'];
    if (!userId || !users[userId]) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    req.user = users[userId];
    next();
}

// Task creation
app.post('/tasks', authenticateUser, (req, res) => {
    const { title, description, dueDate, category, priority } = req.body;
    const task = {
        id: nextTaskId++,
        title,
        description,
        dueDate,
        category,
        priority,
        completed: false
    };
    tasks.push(task);
    res.status(201).json(task);
});

// Task categorization
app.put('/tasks/:id/category', authenticateUser, (req, res) => {
    const taskId = parseInt(req.params.id);
    const { category } = req.body;
    const task = tasks.find(task => task.id === taskId);
    if (!task) {
        return res.status(404).json({ message: 'Task not found' });
    }
    task.category = category;
    res.json(task);
});

// Task status
app.put('/tasks/:id/complete', authenticateUser, (req, res) => {
    const taskId = parseInt(req.params.id);
    const task = tasks.find(task => task.id === taskId);
    if (!task) {
        return res.status(404).json({ message: 'Task not found' });
    }
    task.completed = true;
    res.json(task);
});

// View tasks
app.get('/tasks', authenticateUser, (req, res) => {
    let filteredTasks = [...tasks];
    const { sortBy } = req.query;
    if (sortBy === 'dueDate') {
        filteredTasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    } else if (sortBy === 'category') {
        filteredTasks.sort((a, b) => a.category.localeCompare(b.category));
    } else if (sortBy === 'completed') {
        filteredTasks.sort((a, b) => a.completed - b.completed);
    }
    res.json(filteredTasks);
});

// Priority levels
app.put('/tasks/:id/priority', authenticateUser, (req, res) => {
    const taskId = parseInt(req.params.id);
    const { priority } = req.body;
    const task = tasks.find(task => task.id === taskId);
    if (!task) {
        return res.status(404).json({ message: 'Task not found' });
    }
    task.priority = priority;
    res.json(task);
});

// User registration
app.post('/register', (req, res) => {
    const { username, password } = req.body;
    if (users[username]) {
        return res.status(400).json({ message: 'User already exists' });
    }
    users[username] = { username, password };
    res.status(201).json({ message: 'User registered successfully' });
});

// User login
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (!users[username] || users[username].password !== password) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }
    res.json({ token: username });
});

app.listen(port, () => {
    console.log(`Task management system running at http://localhost:${port}`);
});
