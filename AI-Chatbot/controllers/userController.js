// controllers/userController.js
const { formatDateForMySQL } = require('../utils/dateFormatter');
const db = require('../config/database');

class UserController {
    async createUser(req, res, next) {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            const { firebaseId, email, name, createAt, lastLogin } = req.body;

            // Validation
            if (!firebaseId || !email) {
                throw new Error('firebaseId and email are required');
            }

            // Check if Firebase login exists
            const [existingFirebaseLogins] = await connection.execute(
                'SELECT * FROM Firebase_Login WHERE ID = ?',
                [firebaseId]
            );

            // Create Firebase login if it doesn't exist
            if (existingFirebaseLogins.length === 0) {
                await connection.execute(
                    'INSERT INTO Firebase_Login (ID, email, password) VALUES (?, ?, ?)',
                    [firebaseId, email, 'firebase-managed']
                );
            }

            // Check if user exists
            const [existingUsers] = await connection.execute(
                'SELECT * FROM Users WHERE firebase_ID = ?',
                [firebaseId]
            );

            let userId;
            if (existingUsers.length > 0) {
                userId = existingUsers[0].user_ID;
                // Update last login
                await connection.execute(
                    'UPDATE Users SET last_login = ? WHERE user_ID = ?',
                    [formatDateForMySQL(lastLogin || new Date()), userId]
                );
            } else {
                // Generate UUID for new user
                const [uuidResult] = await connection.execute('SELECT UUID() as uuid');
                userId = uuidResult[0].uuid;

                // Create new user
                await connection.execute(
                    'INSERT INTO Users (user_ID, name, create_at, last_login, firebase_ID) VALUES (?, ?, ?, ?, ?)',
                    [
                        userId,
                        name || email.split('@')[0],
                        formatDateForMySQL(createAt || new Date()),
                        formatDateForMySQL(lastLogin || new Date()),
                        firebaseId
                    ]
                );
            }

            await connection.commit();
            res.status(201).json({
                success: true,
                data: {
                    user_ID: userId,
                    firebase_ID: firebaseId,
                    name: name || email.split('@')[0],
                    email
                }
            });

        } catch (error) {
            await connection.rollback();
            next(error);
        } finally {
            connection.release();
        }
    }

    async getUserByFirebaseId(req, res, next) {
        try {
            const { firebaseId } = req.params;

            const [users] = await db.execute(
                'SELECT user_ID, name, create_at, last_login, firebase_ID FROM Users WHERE firebase_ID = ?',
                [firebaseId]
            );

            if (users.length === 0) {
                return res.status(404).json({
                    success: false,
                    error: 'User not found'
                });
            }

            res.json({
                success: true,
                data: users[0]
            });

        } catch (error) {
            next(error);
        }
    }

    async updateLastLogin(req, res, next) {
        const connection = await db.getConnection();
        try {
            const { firebaseId } = req.params;

            const [result] = await connection.execute(
                'UPDATE Users SET last_login = ? WHERE firebase_ID = ?',
                [formatDateForMySQL(new Date()), firebaseId]
            );

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    error: 'User not found'
                });
            }

            res.json({
                success: true,
                message: 'Last login updated successfully'
            });

        } catch (error) {
            next(error);
        } finally {
            connection.release();
        }
    }
}

module.exports = new UserController();