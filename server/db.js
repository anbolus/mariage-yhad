const mysql = require('mysql2/promise');
require('dotenv').config();

const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } = process.env;

const db = mysql.createPool({
    connectionLimit: 10,
    host: DB_HOST,
    user: DB_USER,
    database: DB_NAME,
    password: DB_PASSWORD
});

db.getConnection((err, connection) => {
    if (err) {
        console.error('Error getting connection', err.message);
    } else {
        console.log('Connected to database');
        connection.release();
    }
});

module.exports = db;
