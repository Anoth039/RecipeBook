require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const authRoutes = require('./routes/auth');
const recipeRoutes = require('./routes/recipes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/recipes', recipeRoutes);

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/recipe-book';

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Adatbázis kapcsolat sikeres');
    app.listen(PORT, () => console.log(`Szerver fut: http://localhost:${PORT}`));
  })
  .catch(err => console.error('Adatbázis kapcsolat sikertelen:', err));
