const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const Todo = require('./models/Todo');
const signupRoute = require('./routes/signup');
const signinRoute = require('./routes/signin');

const app = express();
const PORT = 8000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/signup', signupRoute);
app.use('/signin', signinRoute);

// CRUD for Todos
app.get('/todos', async (req, res) => {
  try {
    const todos = await Todo.find();
    res.json({ todos });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/todos', async (req, res) => {
  try {
    const todo = new Todo(req.body);
    const saved = await todo.save();
    res.status(201).json({ todo: saved });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/todos/:id', async (req, res) => {
  try {
    const updated = await Todo.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ todo: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/todos/:id', async (req, res) => {
  try {
    await Todo.findByIdAndDelete(req.params.id);
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start Server
mongoose.connect('mongodb://127.0.0.1:27017/todoapp')
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on http://127.0.0.1:${PORT}`));
  })
  .catch(err => console.error(err));

