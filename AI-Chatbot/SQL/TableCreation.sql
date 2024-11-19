-- SQL/TableCreation.sql
USE `mental_health_support`;

DROP TABLE IF EXISTS `Conversation_Summaries`;
DROP TABLE IF EXISTS `Emotional_Patterns`;
DROP TABLE IF EXISTS `Crisis_Events`;
DROP TABLE IF EXISTS `Messages`;
DROP TABLE IF EXISTS `Conversations`;
DROP TABLE IF EXISTS `Accessed_By`;
DROP TABLE IF EXISTS `Users`;
DROP TABLE IF EXISTS `Firebase_Login`;
DROP TABLE IF EXISTS `Used_In`;
DROP TABLE IF EXISTS `Resources`;
DROP TABLE IF EXISTS `Categories`;
DROP TABLE IF EXISTS `Tags`;

CREATE TABLE Tags (
    tag_ID INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE Categories (
    category_ID INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    icon VARCHAR(50) NOT NULL
);

CREATE TABLE Resources (
    resource_ID INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    address VARCHAR(255),
    description TEXT,
    website_URL VARCHAR(255),
    phone VARCHAR(20),
    hours VARCHAR(100),
    category_ID INT,
    FOREIGN KEY (category_ID) REFERENCES Categories(category_ID),
    INDEX idx_resources_category (category_ID)
);

CREATE TABLE Used_In (
    tag_ID INT,
    resource_ID INT,
    PRIMARY KEY (tag_ID, resource_ID),
    FOREIGN KEY (tag_ID) REFERENCES Tags(tag_ID),
    FOREIGN KEY (resource_ID) REFERENCES Resources(resource_ID)
);

CREATE TABLE Firebase_Login (
    ID VARCHAR(128) PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE Users (
    user_ID VARCHAR(128) PRIMARY KEY,
    name VARCHAR(100),
    create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP,
    firebase_ID VARCHAR(128),
    FOREIGN KEY (firebase_ID) REFERENCES Firebase_Login(ID)
);

CREATE TABLE Accessed_By (
    user_ID VARCHAR(128),
    resource_ID INT,
    access_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    referral_source ENUM('chat', 'search', 'category_browse', 'crisis'),
    PRIMARY KEY (user_ID, resource_ID, access_time),
    FOREIGN KEY (user_ID) REFERENCES Users(user_ID),
    FOREIGN KEY (resource_ID) REFERENCES Resources(resource_ID)
);

CREATE TABLE Conversations (
    conversation_ID INT PRIMARY KEY AUTO_INCREMENT,
    start_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    end_time TIMESTAMP,
    risk_level ENUM('low', 'medium', 'high') DEFAULT 'low',
    status ENUM('active', 'liminal', 'completed') DEFAULT 'active',
    user_ID VARCHAR(128),
    last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_ID) REFERENCES Users(user_ID),
    INDEX idx_status_last_activity (status, last_activity),
    INDEX idx_conversations_user (user_ID)
);

CREATE TABLE Messages (
    message_ID INT PRIMARY KEY AUTO_INCREMENT,
    conversation_ID INT,
    content TEXT NOT NULL,
    sender_type ENUM('user', 'ai') NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    emotional_state JSON,
    FOREIGN KEY (conversation_ID) REFERENCES Conversations(conversation_ID),
    INDEX idx_conversation_timestamp (conversation_ID, timestamp)
);

CREATE TABLE Crisis_Events (
    event_ID INT PRIMARY KEY AUTO_INCREMENT,
    conversation_ID INT,
    user_ID VARCHAR(128),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolution_notes TEXT,
    severity_level ENUM('moderate', 'severe', 'critical') NOT NULL,
    action_taken TEXT NOT NULL,
    resolved_at TIMESTAMP,
    FOREIGN KEY (conversation_ID) REFERENCES Conversations(conversation_ID),
    FOREIGN KEY (user_ID) REFERENCES Users(user_ID),
    INDEX idx_crisis_user (user_ID)
);

CREATE TABLE Emotional_Patterns (
    pattern_ID INT PRIMARY KEY AUTO_INCREMENT,
    pattern_type VARCHAR(50) NOT NULL,
    pattern_value TEXT NOT NULL,
    first_detected TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_detected TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    occurrence_count INT DEFAULT 1,
    confidence_score DECIMAL(5,2),
    user_ID VARCHAR(128),
    FOREIGN KEY (user_ID) REFERENCES Users(user_ID),
    INDEX idx_emotional_patterns_user (user_ID)
);

CREATE TABLE Conversation_Summaries (
    summary_ID INT PRIMARY KEY AUTO_INCREMENT,
    conversation_ID INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    emotions JSON,
    main_concerns JSON,
    progress_notes JSON,
    recommendations JSON,
    raw_summary TEXT,
    FOREIGN KEY (conversation_ID) REFERENCES Conversations(conversation_ID) ON DELETE CASCADE,
    INDEX idx_conversation (conversation_ID)
);

SHOW TABLES;