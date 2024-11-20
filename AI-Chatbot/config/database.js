// config/database.js
const mysql = require('mysql2/promise');

const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: 'your_password',
    database: 'mental_health_support',
    waitForConnections: true,
    connectionLimit: 25,
    queueLimit: 30,
    timezone: 'America/Denver',
    dateStrings: true
};

// Create the connection pool
const pool = mysql.createPool(dbConfig);

// Test database connection and timezone
pool.getConnection()
    .then(async connection => {
        if (process.env.NODE_ENV !== 'test') {
            try {
                const [timeZoneRows] = await connection.execute(
                    'SELECT @@session.time_zone, @@global.time_zone'
                );
                console.log('MySQL Timezone Settings:', timeZoneRows[0]);

                const [nowRows] = await connection.execute(
                    'SELECT NOW() as now_time'
                );
                console.log('Database Time:', nowRows[0].now_time);
                console.log('Local JS Time:', new Date().toLocaleString('en-US', {
                    timeZone: 'America/Denver'
                }));

                console.log('Database connected successfully');
            } catch (err) {
                console.error('Error checking timezone:', err);
            }
        }
        connection.release();
    })
    .catch(err => {
        console.error('Error connecting to the database:', err);
    });

module.exports = pool;