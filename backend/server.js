const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/menu', require('./routes/menu'));
app.use('/api/ingredients', require('./routes/ingredients'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/users', require('./routes/users'));

app.get('/', (req, res) => res.json({ message: 'BurgerBliss API Running' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🍔 BurgerBliss Server running on port ${PORT}`));
