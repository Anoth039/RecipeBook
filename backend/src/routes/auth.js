const router = require('express').Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const SECRET = process.env.JWT_SECRET || 'recipe-secret-key';

router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ message: 'Felhasználónév és jelszó megadása kötelező' });

    const exists = await User.findOne({ username });
    if (exists) return res.status(409).json({ message: 'A felhasználónév már foglalt' });

    const user = await User.create({ username, password });
    const token = jwt.sign({ id: user._id, username: user.username }, SECRET, { expiresIn: '8h' });
    res.status(201).json({ token, username: user.username });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ message: 'Hibás felhasználónév vagy jelszó' });

    const ok = await user.comparePassword(password);
    if (!ok) return res.status(401).json({ message: 'Hibás felhasználónév vagy jelszó' });

    const token = jwt.sign({ id: user._id, username: user.username }, SECRET, { expiresIn: '8h' });
    res.json({ token, username: user.username });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
