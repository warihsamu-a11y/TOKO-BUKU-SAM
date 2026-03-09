const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'toko_buku',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

(async () => {
  try {
    const connection = await pool.getConnection();
    await connection.execute(
      'ALTER TABLE orders ADD COLUMN payment_method VARCHAR(50) DEFAULT "transfer" AFTER total'
    );
    console.log('✅ payment_method column added successfully!');
    connection.release();
    process.exit(0);
  } catch (error) {
    if (error.code === '1060') {
      console.log('✅ Column already exists');
    } else {
      console.error('❌ Error:', error.message);
    }
    process.exit(0);
  }
})();
