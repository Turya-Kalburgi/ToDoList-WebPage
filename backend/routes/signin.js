// nano backend/routes/signin.js

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const SECRET = 'mysecretkey'; // use env in production

router.post('/', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'User not found' });

    console.log('Entered Password:', password);
    console.log('Hashed Password in DB:', user.password);

    const match = await user.comparePassword(password);
    console.log('Password match result:', match);

    if (!match) return res.status(401).json({ error: 'Invalid password' });

    const token = jwt.sign({ id: user._id }, SECRET, { expiresIn: '1d' });

    res.json({ token, name: user.name });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Signin failed' });
  }
});

module.exports = router;
