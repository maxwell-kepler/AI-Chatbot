USE `mental_health_support`;

DROP TABLE IF EXISTS `users`;

DROP TABLE IF EXISTS `resource_tags`;
DROP TABLE IF EXISTS `resources`;
DROP TABLE IF EXISTS `categories`;
DROP TABLE IF EXISTS `tags`;

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

    notification_preferences JSON,
    privacy_settings JSON,
    
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_email (email),
    INDEX idx_username (username)
);

CREATE TABLE categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    icon VARCHAR(50) NOT NULL
);

CREATE TABLE resources (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    category_id INT NOT NULL,
    phone VARCHAR(20),
    address VARCHAR(255),
    hours VARCHAR(100),
    website VARCHAR(255),
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

CREATE TABLE tags (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE resource_tags (
    resource_id INT,
    tag_id INT,
    PRIMARY KEY (resource_id, tag_id),
    FOREIGN KEY (resource_id) REFERENCES resources(id),
    FOREIGN KEY (tag_id) REFERENCES tags(id)
);

SHOW TABLES;