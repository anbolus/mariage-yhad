const mysql = require('mysql2/promise');
require('dotenv').config();

const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } = process.env;

const pool = mysql.createPool({
  host: DB_HOST,
  user: DB_USER,
  database: DB_NAME,
  password: DB_PASSWORD
});

const initDatabase = async () => {
    try {
        const connection = await pool.getConnection();
        console.log('Connected to the database.');
    } catch (error) {
        console.error(error);
    }
}
initDatabase();
module.exports = pool;
