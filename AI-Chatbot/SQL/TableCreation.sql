USE `mental_health_support`;

DROP TABLE IF EXISTS `users`;

-- Create User table
CREATE TABLE users (
    user_id VARCHAR(36) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    username VARCHAR(50) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    
    -- Profile fields
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    date_of_birth DATE,
    
    -- Preferences and Settings
    notification_preferences JSON,
    privacy_settings JSON,
    
    -- Meta information
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Indexes
    INDEX idx_email (email),
    INDEX idx_username (username)
);

-- Create a sample user (for testing)
INSERT INTO users (
    user_id, 
    email, 
    password_hash,
    username,
    first_name,
    last_name
) VALUES (
    UUID(),
    'test@example.com',
    '$2b$10$ExampleHashedPassword',
    'testuser',
    'Test',
    'User'
);

SELECT * FROM users;