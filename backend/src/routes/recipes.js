const router = require('express').Router();
const auth = require('../middleware/auth');
const Recipe = require('../models/Recipe');

router.get('/', auth, async (req, res) => {
  try {
    const recipes = await Recipe.find({ owner: req.user.id }).sort({ createdAt: -1 });
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const exists = await Recipe.findOne({ name: req.body.name });
    if (exists) return res.status(409).json({ message: 'Egy recept ezzel a névvel már létezik' });

    const recipe = await Recipe.create({ ...req.body, owner: req.user.id });
    res.status(201).json(recipe);
  } catch (err) {
    if (err.name === 'ValidationError') return res.status(400).json({ message: err.message });
    res.status(500).json({ message: err.message });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const recipe = await Recipe.findOne({ _id: req.params.id, owner: req.user.id });
    if (!recipe) return res.status(404).json({ message: 'Recept nem található' });

    if (req.body.name && req.body.name !== recipe.name) {
      const exists = await Recipe.findOne({ name: req.body.name });
      if (exists) return res.status(409).json({ message: 'Egy recept ezzel a névvel már létezik' });
    }

    Object.assign(recipe, req.body);
    await recipe.save();
    res.json(recipe);
  } catch (err) {
    if (err.name === 'ValidationError') return res.status(400).json({ message: err.message });
    res.status(500).json({ message: err.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const result = await Recipe.deleteOne({ _id: req.params.id, owner: req.user.id });
    if (result.deletedCount === 0) return res.status(404).json({ message: 'Recept nem található' });
    res.json({ message: 'Törölve' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
