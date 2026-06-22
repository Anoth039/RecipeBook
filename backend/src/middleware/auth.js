const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET || 'recipe-secret-key';

module.exports = function auth(req, res, next) {
  const header = req.headers['authorization'];
  if (!header) return res.status(401).json({ message: 'Nincs token megadva' });
  const token = header.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Hibás token' });
  try {
    req.user = jwt.verify(token, SECRET);
    next();
  } catch {
    res.status(401).json({ message: 'Érvénytelen token' });
  }
};
