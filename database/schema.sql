-- Database Schema for ONPF Application
-- نظام قاعدة البيانات لتطبيق إدارة الملفات العقارية

-- Create Database
CREATE DATABASE IF NOT EXISTS onpf_db;
USE onpf_db;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role ENUM('EDITOR', 'VERIFIER', 'SENIOR_VERIFIER') NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_username (username),
    INDEX idx_email (email),
    INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Real Estate Files Table
CREATE TABLE IF NOT EXISTS real_estate_files (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    file_number VARCHAR(50) UNIQUE NOT NULL,
    lot_number VARCHAR(50) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    filing_date DATE NOT NULL,
    status ENUM(
        'NEW',
        'UNDER_STUDY',
        'AWAITING_VERIFICATION',
        'UNDER_VERIFICATION',
        'RETURNED_FOR_CORRECTION',
        'AWAITING_FINAL_VERIFICATION',
        'UNDER_FINAL_VERIFICATION',
        'APPROVED',
        'CLOSED'
    ) NOT NULL DEFAULT 'NEW',
    source VARCHAR(255),
    study_responsible_id BIGINT,
    assigned_to_id BIGINT,
    notes LONGTEXT,
    cadastral_data LONGTEXT,
    registration_data LONGTEXT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (study_responsible_id) REFERENCES users(id),
    FOREIGN KEY (assigned_to_id) REFERENCES users(id),
    INDEX idx_file_number (file_number),
    INDEX idx_status (status),
    INDEX idx_filing_date (filing_date),
    INDEX idx_assigned_to (assigned_to_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Legal Documents Table
CREATE TABLE IF NOT EXISTS legal_documents (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    file_id BIGINT NOT NULL,
    document_type VARCHAR(100) NOT NULL,
    document_number VARCHAR(50) NOT NULL,
    document_date DATE NOT NULL,
    status ENUM('PENDING', 'VERIFIED', 'REJECTED') NOT NULL DEFAULT 'PENDING',
    notes LONGTEXT,
    verification_result ENUM('APPROVED', 'REJECTED', 'PENDING'),
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (file_id) REFERENCES real_estate_files(id) ON DELETE CASCADE,
    INDEX idx_file_id (file_id),
    INDEX idx_status (status),
    INDEX idx_document_number (document_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Operations Table (Transaction Log)
CREATE TABLE IF NOT EXISTS operations (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    file_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    operation_type VARCHAR(100) NOT NULL,
    previous_status VARCHAR(50),
    new_status VARCHAR(50),
    notes LONGTEXT,
    timestamp DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (file_id) REFERENCES real_estate_files(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id),
    INDEX idx_file_id (file_id),
    INDEX idx_user_id (user_id),
    INDEX idx_timestamp (timestamp),
    INDEX idx_operation_type (operation_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert Sample Users
INSERT INTO users (username, password, email, full_name, role) VALUES
('editor_user', '$2a$10$slYQmyNdGzDKJSDL1d6i5uj.7wV1f1Z1KKK1KKK1KKK1KKK1KKK1K', 'editor@onpf.tn', 'محرر النظام', 'EDITOR'),
('verifier_user', '$2a$10$slYQmyNdGzDKJSDL1d6i5uj.7wV1f1Z1KKK1KKK1KKK1KKK1KKK1K', 'verifier@onpf.tn', 'متثبت النظام', 'VERIFIER'),
('senior_verifier', '$2a$10$slYQmyNdGzDKJSDL1d6i5uj.7wV1f1Z1KKK1KKK1KKK1KKK1KKK1K', 'senior@onpf.tn', 'متثبت أعلى', 'SENIOR_VERIFIER');

-- Note: Passwords are hashed using BCrypt (plaintext: password)
-- For security, change these credentials after deployment
