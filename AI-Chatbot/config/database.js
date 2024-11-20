// config/database.js
const mysql = require('mysql2/promise');

const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: 'your_password',
    database: 'mental_health_support',
    waitForConnections: true,
    connectionLimit: 25,
    queueLimit: 30
};

// Create the connection pool
const pool = mysql.createPool(dbConfig);
// Test database connection
pool.getConnection()
    .then(connection => {
        if (process.env.NODE_ENV !== 'test') {
            console.log('Database connected successfully');
        }
        connection.release();
    })
    .catch(err => {
        console.error('Error connecting to the database:', err);
    });
module.exports = pool;