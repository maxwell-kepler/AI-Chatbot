// routes/resourceRoutes.js
import { Router } from 'express';
const router = Router();
const db = require('../config/database');


// Get user by ID
router.get('/:id', async (req, res) => {
    try {
        const [rows] = await db.execute(
            'SELECT user_id, email, username, first_name, last_name FROM users WHERE user_id = ?',
            [req.params.id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create new user
router.post('/', async (req, res) => {
    const { email, password, username, firstName, lastName } = req.body;

    try {
        const [result] = await db.execute(
            'INSERT INTO users (user_id, email, password_hash, username, first_name, last_name) VALUES (UUID(), ?, ?, ?, ?, ?)',
            [email, password, username, firstName, lastName]
        );

        res.status(201).json({
            message: 'User created successfully',
            userId: result.insertId
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;