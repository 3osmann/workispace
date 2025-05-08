
-- Create database if not exists
CREATE DATABASE IF NOT EXISTS dary_db DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE dary_db;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    prenom VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL COMMENT 'Store hashed password',
    role ENUM('admin', 'user' , 'owner') NOT NULL DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Places Table (Fixed Index Issue)
CREATE TABLE IF NOT EXISTS places (
    place_id INT AUTO_INCREMENT PRIMARY KEY,
    nom_place VARCHAR(255) NOT NULL,
    description TEXT,
    location VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci COMMENT 'Human-readable address',
    longitude DECIMAL(9,6) NOT NULL,
    latitude DECIMAL(9,6) NOT NULL,
    url_img VARCHAR(512) COMMENT 'URL to image',
    url_web VARCHAR(512) COMMENT 'Website URL',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_location (location(150)), -- Reduced index length to avoid the error
    INDEX idx_coordinates (latitude, longitude) -- Keep coordinate index for fast searches
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert test users (if they don't exist)
-- Note: The password is 'password123' for all users (hashed with bcrypt)
INSERT IGNORE INTO users (nom, prenom, email, password_hash, role) VALUES 
('Admin', 'Super', 'admin@example.com', '$2y$10$pK817LAG9Q6FQ7EJJP/p0OHKo4sxPxSFN0GMhYbvCQwwUQ3kUSwti', 'admin'),
('Propriétaire', 'Un', 'proprietaire1@example.com', '$2y$10$pK817LAG9Q6FQ7EJJP/p0OHKo4sxPxSFN0GMhYbvCQwwUQ3kUSwti', 'owner'),
('Propriétaire', 'Deux', 'proprietaire2@example.com', '$2y$10$pK817LAG9Q6FQ7EJJP/p0OHKo4sxPxSFN0GMhYbvCQwwUQ3kUSwti', 'owner'),
('Utilisateur', 'Simple', 'user@example.com', '$2y$10$pK817LAG9Q6FQ7EJJP/p0OHKo4sxPxSFN0GMhYbvCQwwUQ3kUSwti', 'owner'),
('Dubois', 'Marie', 'marie.dubois@example.com', '$2y$10$pK817LAG9Q6FQ7EJJP/p0OHKo4sxPxSFN0GMhYbvCQwwUQ3kUSwti', 'owner'),
('Martin', 'Jean', 'jean.martin@example.com', '$2y$10$pK817LAG9Q6FQ7EJJP/p0OHKo4sxPxSFN0GMhYbvCQwwUQ3kUSwti', 'owner'),
('Leroy', 'Sophie', 'sophie.leroy@example.com', '$2y$10$pK817LAG9Q6FQ7EJJP/p0OHKo4sxPxSFN0GMhYbvCQwwUQ3kUSwti', 'owner'),
('Durand', 'Pierre', 'pierre.durand@example.com', '$2y$10$pK817LAG9Q6FQ7EJJP/p0OHKo4sxPxSFN0GMhYbvCQwwUQ3kUSwti', 'admin'),
('Moreau', 'Inès', 'ines.moreau@example.com', '$2y$10$pK817LAG9Q6FQ7EJJP/p0OHKo4sxPxSFN0GMhYbvCQwwUQ3kUSwti', 'user');
