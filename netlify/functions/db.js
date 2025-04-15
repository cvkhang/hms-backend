require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST,     
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Lỗi kết nối đến database:', err.stack);
  } else {
    console.log('Kết nối database thành công tại:', res.rows[0].now);
  }
});


module.exports = {
  query: (text, params) => pool.query(text, params),
};
