const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { adminMiddleware } = require('../middleware/auth');

// GET all ingredients
router.get('/', async (req, res) => {
  try {
    const [ingredients] = await db.execute('SELECT * FROM ingredients WHERE is_available = 1 ORDER BY category, id');
    res.json(ingredients);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ADMIN: Add ingredient
router.post('/', adminMiddleware, async (req, res) => {
  const { name, category, price, is_popular, is_diet, is_keto, kcal, protein } = req.body;
  try {
    const [result] = await db.execute(
      'INSERT INTO ingredients (name, category, price, is_popular, is_diet, is_keto, kcal, protein) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [name, category, price, is_popular || 0, is_diet || 0, is_keto || 0, kcal || 0, protein || 0]
    );
    res.json({ message: 'Ingredient added', id: result.insertId });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ADMIN: Update ingredient
router.put('/:id', adminMiddleware, async (req, res) => {
  const { name, price, is_popular, is_diet, is_keto, kcal, protein, is_available } = req.body;
  try {
    await db.execute(
      'UPDATE ingredients SET name=?, price=?, is_popular=?, is_diet=?, is_keto=?, kcal=?, protein=?, is_available=? WHERE id=?',
      [name, price, is_popular, is_diet, is_keto, kcal, protein, is_available, req.params.id]
    );
    res.json({ message: 'Ingredient updated' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
