const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

// Routes will go here

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

const User = mongoose.model('User', userSchema);

module.exports = User;

app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const user = new User({ username, password: hashedPassword });
        await user.save();
        res.send('User registered successfully');
    } catch (err) {
        res.status(400).send('Error registering user');
    }
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (user && await bcrypt.compare(password, user.password)) {
        req.session.userId = user._id;
        res.send('Login successful');
    } else {
        res.status(401).send('Invalid credentials');
    }
});
app.post('/tasks', async (req, res) => {
    // Create new task
});

app.put('/tasks/:id', async (req, res) => {
    // Update task
});

app.delete('/tasks/:id', async (req, res) => {
    // Delete task
});

app.get('/tasks', async (req, res) => {
    // Get tasks
});
app.get('/tasks', async (req, res) => {
    if (!req.session.userId) {
        return res.status(401).send('Unauthorized');
    }

    // Get tasks
});
