const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { adminMiddleware, authMiddleware } = require('../middleware/auth');

// ADMIN: Get all users
router.get('/', adminMiddleware, async (req, res) => {
  try {
    const [users] = await db.execute(
      `SELECT u.id, u.name, u.email, u.phone, u.role, u.reward_points, u.is_active, u.created_at,
       COUNT(o.id) as total_orders FROM users u LEFT JOIN orders o ON u.id = o.user_id
       WHERE u.role = 'user' GROUP BY u.id ORDER BY u.created_at DESC`
    );
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ADMIN: Get user order history
router.get('/:id/orders', adminMiddleware, async (req, res) => {
  try {
    const [orders] = await db.execute(
      'SELECT o.*, GROUP_CONCAT(oi.burger_name SEPARATOR ", ") as items FROM orders o LEFT JOIN order_items oi ON o.id = oi.order_id WHERE o.user_id = ? GROUP BY o.id ORDER BY o.created_at DESC',
      [req.params.id]
    );
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ADMIN: Toggle user active status
router.put('/:id/toggle', adminMiddleware, async (req, res) => {
  try {
    await db.execute('UPDATE users SET is_active = NOT is_active WHERE id = ?', [req.params.id]);
    res.json({ message: 'User status updated' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Save reward (user)
router.post('/rewards', authMiddleware, async (req, res) => {
  const { reward_type, reward_value } = req.body;
  try {
    await db.execute(
      'INSERT INTO rewards (user_id, reward_type, reward_value) VALUES (?, ?, ?)',
      [req.user.id, reward_type, reward_value]
    );
    res.json({ message: 'Reward saved' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get user rewards
router.get('/rewards/mine', authMiddleware, async (req, res) => {
  try {
    const [rewards] = await db.execute(
      'SELECT * FROM rewards WHERE user_id = ? AND is_used = 0 ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json(rewards);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
