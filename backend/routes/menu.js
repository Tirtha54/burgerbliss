const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { adminMiddleware } = require('../middleware/auth');

// GET all burgers
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    let query = 'SELECT * FROM burgers WHERE is_available = 1';
    const params = [];
    if (category && category !== 'All') {
      query += ' AND category = ?';
      params.push(category);
    }
    const [burgers] = await db.execute(query, params);
    res.json(burgers);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ADMIN: Add burger
router.post('/', adminMiddleware, async (req, res) => {
  const { name, description, price, category, tags, kcal, protein } = req.body;
  try {
    const [result] = await db.execute(
      'INSERT INTO burgers (name, description, price, category, tags, kcal, protein) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, description, price, category, tags, kcal || 0, protein || 0]
    );
    res.json({ message: 'Burger added', id: result.insertId });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ADMIN: Update burger
router.put('/:id', adminMiddleware, async (req, res) => {
  const { name, description, price, category, tags, kcal, protein, is_available } = req.body;
  try {
    await db.execute(
      'UPDATE burgers SET name=?, description=?, price=?, category=?, tags=?, kcal=?, protein=?, is_available=? WHERE id=?',
      [name, description, price, category, tags, kcal, protein, is_available, req.params.id]
    );
    res.json({ message: 'Burger updated' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ADMIN: Delete burger
router.delete('/:id', adminMiddleware, async (req, res) => {
  try {
    await db.execute('UPDATE burgers SET is_available = 0 WHERE id = ?', [req.params.id]);
    res.json({ message: 'Burger disabled' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
