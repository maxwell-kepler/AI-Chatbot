//server.js
const express = require('express');
const cors = require('cors');
const db = require('./config/database');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
    console.log(`\n${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// Test endpoint
app.get('/api/test', (req, res) => {
    console.log('Test endpoint hit');
    res.json({
        message: 'Backend is working!',
        timestamp: new Date().toISOString()
    });
});

// Get all users
app.get('/api/users', async (req, res) => {
    try {
        const [rows] = await db.execute(
            'SELECT user_ID, name, create_at, last_login, firebase_ID FROM Users ORDER BY create_at DESC'
        );
        res.json(rows);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({
            message: 'Failed to fetch users',
            error: error.message
        });
    }
});

// Get all categories
app.get('/api/categories', async (req, res) => {
    try {
        const [rows] = await db.execute(
            'SELECT category_ID, name, icon FROM Categories'
        );
        res.json(rows);
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({
            message: 'Failed to fetch categories',
            error: error.message
        });
    }
});

// Get all resources with tags and category info
app.get('/api/resources', async (req, res) => {
    try {
        const [rows] = await db.execute(`
            SELECT 
                r.*,
                c.name as category_name,
                c.icon as category_icon,
                GROUP_CONCAT(DISTINCT t.name) as tags
            FROM Resources r
            LEFT JOIN Categories c ON r.category_ID = c.category_ID
            LEFT JOIN Used_In ui ON r.resource_ID = ui.resource_ID
            LEFT JOIN Tags t ON ui.tag_ID = t.tag_ID
            GROUP BY r.resource_ID, r.name, r.description, r.category_ID, 
                     r.phone, r.address, r.hours, r.website_URL,
                     c.name, c.icon
        `);

        // Process the results to convert the comma-separated tags into arrays
        const formattedResources = rows.map(resource => ({
            ...resource,
            tags: resource.tags ? resource.tags.split(',') : []
        }));

        res.json(formattedResources);
    } catch (error) {
        console.error('Error fetching resources:', error);
        res.status(500).json({
            message: 'Failed to fetch resources',
            error: error.message
        });
    }
});

// Get all tags
app.get('/api/tags', async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT tag_ID, name FROM Tags');
        res.json(rows);
    } catch (error) {
        console.error('Error fetching tags:', error);
        res.status(500).json({
            message: 'Failed to fetch tags',
            error: error.message
        });
    }
});

// Get resources by category
app.get('/api/categories/:categoryId/resources', async (req, res) => {
    try {
        const [rows] = await db.execute(`
            SELECT 
                r.*,
                c.name as category_name,
                c.icon as category_icon,
                GROUP_CONCAT(t.name) as tags
            FROM Resources r
            LEFT JOIN Categories c ON r.category_ID = c.category_ID
            LEFT JOIN Used_In ui ON r.resource_ID = ui.resource_ID
            LEFT JOIN Tags t ON ui.tag_ID = t.tag_ID
            WHERE r.category_ID = ?
            GROUP BY r.resource_ID
        `, [req.params.categoryId]);

        const formattedResources = rows.map(resource => ({
            ...resource,
            tags: resource.tags ? resource.tags.split(',') : []
        }));

        res.json(formattedResources);
    } catch (error) {
        console.error('Error fetching resources by category:', error);
        res.status(500).json({
            message: 'Failed to fetch resources',
            error: error.message
        });
    }
});

// Helper function to format datetime for MySQL
const formatDateForMySQL = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().slice(0, 19).replace('T', ' ');
};

// Create new user with Firebase ID
app.post('/api/users', async (req, res) => {
    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        const { firebaseId, email, name, createAt, lastLogin } = req.body;

        // Validation
        if (!firebaseId || !email) {
            return res.status(400).json({
                message: 'firebaseId and email are required'
            });
        }

        // Check if Firebase login already exists
        const [existingFirebaseLogins] = await connection.execute(
            'SELECT * FROM Firebase_Login WHERE ID = ?',
            [firebaseId]
        );

        // If no Firebase login exists, create it
        if (existingFirebaseLogins.length === 0) {
            await connection.execute(
                'INSERT INTO Firebase_Login (ID, email, password) VALUES (?, ?, ?)',
                [firebaseId, email, 'firebase-managed'] // Password is managed by Firebase
            );
        }

        // Check if user already exists
        const [existingUsers] = await connection.execute(
            'SELECT * FROM Users WHERE firebase_ID = ?',
            [firebaseId]
        );

        if (existingUsers.length > 0) {
            await connection.rollback();
            return res.status(409).json({
                message: 'User already exists'
            });
        }

        // Format dates for MySQL
        const formattedCreateAt = formatDateForMySQL(createAt || new Date());
        const formattedLastLogin = formatDateForMySQL(lastLogin || new Date());

        // Create user
        await connection.execute(
            'INSERT INTO Users (user_ID, name, create_at, last_login, firebase_ID) VALUES (UUID(), ?, ?, ?, ?)',
            [name, formattedCreateAt, formattedLastLogin, firebaseId]
        );

        // Fetch created user
        const [users] = await connection.execute(
            'SELECT * FROM Users WHERE firebase_ID = ?',
            [firebaseId]
        );

        await connection.commit();
        res.status(201).json(users[0]);

    } catch (error) {
        await connection.rollback();
        console.error('Error creating user:', error);
        res.status(500).json({
            message: 'Failed to create user',
            error: error.message
        });
    } finally {
        connection.release();
    }
});

// Get user by Firebase ID
app.get('/api/users/firebase/:firebaseId', async (req, res) => {
    try {
        const [users] = await db.execute(
            'SELECT * FROM Users WHERE firebase_ID = ?',
            [req.params.firebaseId]
        );

        if (users.length === 0) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        res.json(users[0]);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({
            message: 'Failed to fetch user',
            error: error.message
        });
    }
});

// Update last login time
app.put('/api/users/firebase/:firebaseId/login', async (req, res) => {
    try {
        const [result] = await db.execute(
            'UPDATE Users SET last_login = NOW() WHERE firebase_ID = ?',
            [req.params.firebaseId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        res.json({
            message: 'Last login updated successfully'
        });
    } catch (error) {
        console.error('Error updating last login:', error);
        res.status(500).json({
            message: 'Failed to update last login',
            error: error.message
        });
    }
});

// Create new conversation
app.post('/api/conversations', async (req, res) => {
    try {
        const { userId: firebaseId, status, startTime } = req.body;

        // Input validation
        if (!firebaseId) {
            return res.status(400).json({
                message: 'userId is required'
            });
        }

        // First, get the MySQL user_ID using the firebase_ID
        const [users] = await db.execute(
            'SELECT user_ID FROM Users WHERE firebase_ID = ?',
            [firebaseId]
        );

        if (users.length === 0) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        const mysqlUserId = users[0].user_ID;

        // Format the start time
        const formattedStartTime = formatDateForMySQL(startTime || new Date());

        // Create new conversation
        const [result] = await db.execute(
            'INSERT INTO Conversations (user_ID, status, start_time) VALUES (?, ?, ?)',
            [mysqlUserId, status || 'active', formattedStartTime]
        );

        res.status(201).json({
            message: 'Conversation created successfully',
            conversationId: result.insertId
        });
    } catch (error) {
        console.error('Error creating conversation:', error);
        res.status(500).json({
            message: 'Failed to create conversation',
            error: error.message
        });
    }
});

// Add message to conversation
app.post('/api/conversations/:conversationId/messages', async (req, res) => {
    try {
        const { conversationId } = req.params;
        const { content, senderType, emotionalState, timestamp } = req.body;

        // Input validation
        if (!content || !senderType) {
            return res.status(400).json({
                message: 'content and senderType are required'
            });
        }

        // Format timestamp
        const formattedTimestamp = formatDateForMySQL(timestamp || new Date());

        // Create message
        const [result] = await db.execute(
            'INSERT INTO Messages (conversation_ID, content, sender_type, emotional_state, timestamp) VALUES (?, ?, ?, ?, ?)',
            [conversationId, content, senderType, JSON.stringify(emotionalState), formattedTimestamp]
        );

        res.status(201).json({
            message: 'Message added successfully',
            messageId: result.insertId
        });
    } catch (error) {
        console.error('Error adding message:', error);
        res.status(500).json({
            message: 'Failed to add message',
            error: error.message
        });
    }
});

// Update conversation status
app.put('/api/conversations/:conversationId', async (req, res) => {
    try {
        const { conversationId } = req.params;
        const { status, summary, endTime } = req.body;

        let formattedEndTime = null;
        if (endTime || status !== 'active') {
            formattedEndTime = formatDateForMySQL(endTime || new Date());
        }

        const [result] = await db.execute(
            'UPDATE Conversations SET status = ?, summary = ?, end_time = ? WHERE conversation_ID = ?',
            [status, summary, formattedEndTime, conversationId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: 'Conversation not found'
            });
        }

        res.json({
            message: 'Conversation updated successfully'
        });
    } catch (error) {
        console.error('Error updating conversation:', error);
        res.status(500).json({
            message: 'Failed to update conversation',
            error: error.message
        });
    }
});


// Get user's conversation history
app.get('/api/conversations/user/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        // Get total count
        const [countRows] = await db.execute(
            'SELECT COUNT(*) as total FROM Conversations WHERE user_ID = ?',
            [userId]
        );
        const totalCount = countRows[0].total;

        // Get conversations with message count
        const [conversations] = await db.execute(`
            SELECT 
                c.*,
                COUNT(m.message_ID) as message_count,
                MAX(m.timestamp) as last_message_time
            FROM Conversations c
            LEFT JOIN Messages m ON c.conversation_ID = m.conversation_ID
            WHERE c.user_ID = ?
            GROUP BY c.conversation_ID
            ORDER BY c.start_time DESC
            LIMIT ? OFFSET ?
        `, [userId, limit, offset]);

        res.json({
            conversations,
            currentPage: page,
            totalPages: Math.ceil(totalCount / limit),
            totalCount
        });
    } catch (error) {
        console.error('Error fetching conversations:', error);
        res.status(500).json({
            message: 'Failed to fetch conversations',
            error: error.message
        });
    }
});

// Get messages for a specific conversation
app.get('/api/conversations/:conversationId/messages', async (req, res) => {
    try {
        const { conversationId } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 50;
        const offset = (page - 1) * limit;

        // Get total count
        const [countRows] = await db.execute(
            'SELECT COUNT(*) as total FROM Messages WHERE conversation_ID = ?',
            [conversationId]
        );
        const totalCount = countRows[0].total;

        // Get messages
        const [messages] = await db.execute(`
            SELECT *
            FROM Messages
            WHERE conversation_ID = ?
            ORDER BY timestamp ASC
            LIMIT ? OFFSET ?
        `, [conversationId, limit, offset]);

        res.json({
            messages: messages.map(message => ({
                ...message,
                emotional_state: JSON.parse(message.emotional_state)
            })),
            currentPage: page,
            totalPages: Math.ceil(totalCount / limit),
            totalCount
        });
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({
            message: 'Failed to fetch messages',
            error: error.message
        });
    }
});

// Record crisis event
app.post('/api/conversations/:conversationId/crisis', async (req, res) => {
    try {
        const { conversationId } = req.params;
        const { userId: firebaseId, severityLevel, actionTaken, timestamp } = req.body;

        // Get MySQL user_ID
        const [users] = await db.execute(
            'SELECT user_ID FROM Users WHERE firebase_ID = ?',
            [firebaseId]
        );

        if (users.length === 0) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        const mysqlUserId = users[0].user_ID;
        const formattedTimestamp = formatDateForMySQL(timestamp || new Date());

        const [result] = await db.execute(
            'INSERT INTO Crisis_Events (conversation_ID, user_ID, severity_level, action_taken, timestamp) VALUES (?, ?, ?, ?, ?)',
            [conversationId, mysqlUserId, severityLevel, actionTaken, formattedTimestamp]
        );

        // Update conversation risk level
        await db.execute(
            'UPDATE Conversations SET risk_level = ? WHERE conversation_ID = ?',
            ['high', conversationId]
        );

        res.status(201).json({
            message: 'Crisis event recorded successfully',
            eventId: result.insertId
        });
    } catch (error) {
        console.error('Error recording crisis event:', error);
        res.status(500).json({
            message: 'Failed to record crisis event',
            error: error.message
        });
    }
});

// Update emotional patterns
app.post('/api/users/:userId/emotional-patterns', async (req, res) => {
    try {
        const { userId } = req.params;
        const { patternType, patternValue, firstDetected, lastDetected } = req.body;

        const formattedFirstDetected = formatDateForMySQL(firstDetected || new Date());
        const formattedLastDetected = formatDateForMySQL(lastDetected || new Date());

        const [result] = await db.execute(
            'INSERT INTO Emotional_Patterns (user_ID, pattern_type, pattern_value, first_detected, last_detected) VALUES (?, ?, ?, ?, ?)',
            [userId, patternType, patternValue, formattedFirstDetected, formattedLastDetected]
        );

        res.status(201).json({
            message: 'Emotional pattern recorded successfully',
            patternId: result.insertId
        });
    } catch (error) {
        console.error('Error recording emotional pattern:', error);
        res.status(500).json({
            message: 'Failed to record emotional pattern',
            error: error.message
        });
    }
});

// Record mood
app.post('/api/users/:userId/moods', async (req, res) => {
    try {
        const { userId } = req.params;
        const { moodType, intensity, notes, timestamp } = req.body;

        const formattedTimestamp = formatDateForMySQL(timestamp || new Date());

        const [result] = await db.execute(
            'INSERT INTO Moods (user_ID, mood_type, intensity, notes, timestamp) VALUES (?, ?, ?, ?, ?)',
            [userId, moodType, intensity, notes, formattedTimestamp]
        );

        res.status(201).json({
            message: 'Mood recorded successfully',
            moodId: result.insertId
        });
    } catch (error) {
        console.error('Error recording mood:', error);
        res.status(500).json({
            message: 'Failed to record mood',
            error: error.message
        });
    }
});


// Update conversation risk level
app.put('/api/conversations/:conversationId/risk', async (req, res) => {
    try {
        const { conversationId } = req.params;
        const { riskLevel } = req.body;

        if (!['low', 'medium', 'high'].includes(riskLevel)) {
            return res.status(400).json({
                message: 'Invalid risk level. Must be low, medium, or high'
            });
        }

        const [result] = await db.execute(
            'UPDATE Conversations SET risk_level = ? WHERE conversation_ID = ?',
            [riskLevel, conversationId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: 'Conversation not found'
            });
        }

        res.json({
            message: 'Risk level updated successfully'
        });
    } catch (error) {
        console.error('Error updating risk level:', error);
        res.status(500).json({
            message: 'Failed to update risk level',
            error: error.message
        });
    }
});















// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({
        message: 'Internal server error',
        error: err.message
    });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`\nServer running on http://0.0.0.0:${PORT}`);
    console.log('Available endpoints:');
    console.log('- GET  /api/users');
    console.log('- GET  /api/categories');
    console.log('- GET  /api/resources');
    console.log('- GET  /api/tags');
    console.log('- GET  /api/categories/:categoryId/resources');
    console.log('- POST /api/users');
    console.log('- POST /api/conversations');
    console.log('- POST /api/conversations/:conversationId/messages');
    console.log('- PUT /api/conversations/:conversationId');
    console.log('- GET /api/conversations/user/:userId');
    console.log('- GET /api/conversations/:conversationId/messages');
    console.log('- POST /api/conversations/:conversationId/crisis');
    console.log('- PUT /api/conversations/:conversationId/risk');
});