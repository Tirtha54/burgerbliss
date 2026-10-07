const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
  host:     process.env.DB_HOST     || 'localhost',
  user:     process.env.DB_USER     || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME     || 'burgerbliss',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const db = pool.promise();

// Test connection on startup — shows exact error if MySQL fails
pool.getConnection((err, connection) => {
  if (err) {
    console.error('\n❌ MySQL Connection FAILED');
    console.error('─────────────────────────────────────────');

    if (err.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('🔑 Wrong username or password.');
      console.error('   Fix: Open backend/.env and correct DB_PASSWORD');
      console.error('   Current DB_PASSWORD = ' + process.env.DB_PASSWORD);
    } else if (err.code === 'ER_BAD_DB_ERROR') {
      console.error('🗄️  Database "burgerbliss" does not exist.');
      console.error('   Fix: Run  mysql -u root -p < database/schema.sql');
    } else if (err.code === 'ECONNREFUSED') {
      console.error('🔌 MySQL server is NOT running on your PC.');
      console.error('   Fix: Open Windows Services → start MySQL80');
      console.error('        OR open MySQL Workbench and start Local Instance');
    } else {
      console.error('Error code : ' + err.code);
      console.error('Message    : ' + err.message);
    }

    console.error('\n📄 Your current .env values:');
    console.error('   DB_HOST     = ' + process.env.DB_HOST);
    console.error('   DB_USER     = ' + process.env.DB_USER);
    console.error('   DB_PASSWORD = ' + (process.env.DB_PASSWORD ? '(set)' : '(EMPTY)'));
    console.error('   DB_NAME     = ' + process.env.DB_NAME);
    console.error('─────────────────────────────────────────\n');
    process.exit(1);
    return;
  }

  console.log('✅ MySQL connected successfully — database: ' + process.env.DB_NAME);
  connection.release();
});

module.exports = db;