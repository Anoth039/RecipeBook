const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },
  category: { type: String, required: true, enum: ['Leves', 'Főétel', 'Desszert', 'Saláta', 'Reggeli', 'Köret', 'Snack'] },
  cuisine: { type: String, required: true, enum: ['Magyar', 'Olasz', 'Ázsiai', 'Mexikói', 'Francia', 'Mediterrán', 'Amerikai'] },
  difficulty: { type: String, required: true, enum: ['Könnyű', 'Közepes', 'Nehéz'] },

  prepTimeMinutes: { type: Number, required: true, min: 1, max: 600 },
  servings: { type: Number, required: true, min: 1, max: 50 },
  caloriesPerServing: { type: Number, required: true, min: 0, max: 5000 },

  ingredients: { type: String, required: true },
  instructions: { type: String, required: true },

  allergens: {
    type: [String],
    enum: ['Glutén', 'Tejtermék', 'Tojás', 'Mogyoró', 'Szója', 'Hal', 'Rák', 'Dió', 'Mustár', 'Egyéb'],
    default: []
  },
  allergenNote: { type: String, default: '', trim: true, maxlength: 200 },

  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Recipe', recipeSchema);
