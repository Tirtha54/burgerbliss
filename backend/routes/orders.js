const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

// ── Place Order ────────────────────────────────────────────────
router.post('/', authMiddleware, async (req, res) => {
  const { items, reward_discount, payment_method } = req.body;
  const user_id = req.user.id;

  try {
    const [settings] = await db.execute(
      "SELECT setting_value FROM settings WHERE setting_key = 'gst_percent'"
    );
    const gstPercent = parseFloat(settings[0]?.setting_value || 18);

    let total      = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discount = parseFloat(reward_discount || 0);
    const gst      = ((total - discount) * gstPercent) / 100;
    const final    = total - discount + gst;

    // Save order — now includes payment_method and payment_status
    const [orderResult] = await db.execute(
      `INSERT INTO orders 
        (user_id, total_amount, gst_amount, reward_discount, final_amount, payment_method, payment_status) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [user_id, total, gst.toFixed(2), discount, final.toFixed(2), payment_method || 'cod', 'Paid']
    );

    const orderId = orderResult.insertId;

    // Save order items
    for (const item of items) {
      await db.execute(
        `INSERT INTO order_items 
          (order_id, burger_id, burger_name, quantity, price, is_custom, custom_name, custom_ingredients, kcal, protein) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          orderId,
          item.burger_id || null,
          item.name,
          item.quantity,
          item.price,
          item.is_custom || 0,
          item.custom_name || null,
          item.custom_ingredients || null,
          item.kcal || 0,
          item.protein || 0,
        ]
      );
    }

    // Fetch user and restaurant info for bill
    const [users] = await db.execute('SELECT name FROM users WHERE id = ?', [user_id]);
    const [restaurantSettings] = await db.execute('SELECT setting_key, setting_value FROM settings');
    const sMap = {};
    restaurantSettings.forEach(s => (sMap[s.setting_key] = s.setting_value));

    res.json({
      message: 'Order placed successfully',
      orderId,
      bill: {
        orderId,
        userId: user_id,
        userName: users[0]?.name,
        items,
        subtotal: total.toFixed(2),
        discount: discount.toFixed(2),
        gst: gst.toFixed(2),
        gstPercent,
        final: final.toFixed(2),
        paymentMethod: payment_method || 'cod',
        paymentStatus: 'Paid',
        restaurantName: sMap.restaurant_name,
        restaurantAddress: sMap.restaurant_address,
        restaurantPhone: sMap.restaurant_phone,
        date: new Date().toLocaleString('en-IN'),
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ── GET user's own orders ──────────────────────────────────────
router.get('/my', authMiddleware, async (req, res) => {
  try {
    const [orders] = await db.execute(
      `SELECT o.*, GROUP_CONCAT(oi.burger_name SEPARATOR ', ') as items 
       FROM orders o 
       LEFT JOIN order_items oi ON o.id = oi.order_id 
       WHERE o.user_id = ? 
       GROUP BY o.id 
       ORDER BY o.created_at DESC`,
      [req.user.id]
    );
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ── ADMIN: GET all orders ─────────────────────────────────────
router.get('/admin/all', adminMiddleware, async (req, res) => {
  try {
    const [orders] = await db.execute(
      `SELECT o.*, u.name as user_name, u.email as user_email 
       FROM orders o 
       LEFT JOIN users u ON o.user_id = u.id 
       ORDER BY o.created_at DESC`
    );
    for (const order of orders) {
      const [items] = await db.execute(
        'SELECT * FROM order_items WHERE order_id = ?', [order.id]
      );
      order.order_items = items;
    }
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ── ADMIN: Update order status ────────────────────────────────
router.put('/admin/:id/status', adminMiddleware, async (req, res) => {
  const { status } = req.body;
  try {
    await db.execute('UPDATE orders SET status = ? WHERE id = ?', [status, req.params.id]);
    res.json({ message: 'Order status updated' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ── ADMIN: Dashboard stats ────────────────────────────────────
router.get('/admin/stats', adminMiddleware, async (req, res) => {
  try {
    const [[{ total_orders }]]  = await db.execute(
      "SELECT COUNT(*) as total_orders FROM orders WHERE DATE(created_at) = CURDATE()"
    );
    const [[{ total_revenue }]] = await db.execute(
      "SELECT COALESCE(SUM(final_amount), 0) as total_revenue FROM orders WHERE DATE(created_at) = CURDATE()"
    );
    const [[{ active_users }]]  = await db.execute(
      "SELECT COUNT(*) as active_users FROM users WHERE role = 'user' AND is_active = 1"
    );
    const [popular] = await db.execute(
      "SELECT burger_name, COUNT(*) as cnt FROM order_items GROUP BY burger_name ORDER BY cnt DESC LIMIT 1"
    );
    res.json({
      total_orders,
      total_revenue: parseFloat(total_revenue).toFixed(2),
      active_users,
      popular_burger: popular[0]?.burger_name || 'N/A',
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
