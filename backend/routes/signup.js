// backend/routes/signup.js

const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../models/User');

router.post('/', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ error: 'User already exists' });

    // DO NOT HASH HERE — let mongoose schema do it
    const user = new User({ name, email, password });
    await user.save();

    const token = jwt.sign({ id: user._id }, 'mysecretkey', { expiresIn: '1d' });
    res.json({ token, name: user.name });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Signup failed' });
  }
});

module.exports = router;
