
-- SQL Script to create the properties table

CREATE TABLE properties (
    id VARCHAR(36) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    type VARCHAR(50) NOT NULL,
    bedrooms INT,
    bathrooms DECIMAL(3, 1),
    area DECIMAL(10, 2),
    workstations INT,
    meeting_rooms INT,
    rating DECIMAL(2, 1) NOT NULL,
    status ENUM('available', 'booked', 'maintenance') NOT NULL DEFAULT 'available',
    image_url VARCHAR(2000) NOT NULL,
    property_type ENUM('residential', 'office') NOT NULL,
    owner_id VARCHAR(36),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table for property amenities
CREATE TABLE property_amenities (
    property_id VARCHAR(36) NOT NULL,
    wifi BOOLEAN DEFAULT FALSE,
    parking BOOLEAN DEFAULT FALSE,
    coffee BOOLEAN DEFAULT FALSE,
    reception BOOLEAN DEFAULT FALSE,
    secured BOOLEAN DEFAULT FALSE,
    accessible BOOLEAN DEFAULT FALSE,
    printers BOOLEAN DEFAULT FALSE,
    kitchen BOOLEAN DEFAULT FALSE,
    flexible_hours BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (property_id),
    FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE
);

-- Insert sample residential properties
INSERT INTO properties (id, title, address, price, type, bedrooms, bathrooms, area, rating, status, image_url, property_type)
VALUES
('prop1', 'Villa de Luxe Front de Mer', '123 Ocean Drive, Miami, FL', 350, 'Villa', 4, 3, 2800, 4.9, 'available', 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80', 'residential'),
('prop2', 'Appartement Moderne Centre-Ville', '456 Main St, Seattle, WA', 180, 'Appartement', 2, 2, 1200, 4.7, 'booked', 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80', 'residential'),
('prop3', 'Chalet Confortable en Montagne', '789 Pine Rd, Aspen, CO', 250, 'Chalet', 3, 2, 1800, 4.8, 'maintenance', 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80', 'residential');

-- Insert sample office properties
INSERT INTO properties (id, title, address, price, type, workstations, meeting_rooms, area, rating, status, image_url, property_type)
VALUES
('office1', 'Espace de Coworking Moderne', '100 Tech Ave, San Francisco, CA', 50, 'Coworking', 20, 3, 1500, 4.7, 'available', 'https://images.unsplash.com/photo-1497215842964-222b430dc094?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80', 'office'),
('office2', 'Bureau Exécutif Centre-Ville', '200 Business St, New York, NY', 120, 'Bureau Exécutif', 5, 2, 800, 4.9, 'available', 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80', 'office');

-- Insert amenities for office properties
INSERT INTO property_amenities (property_id, wifi, parking, coffee, reception, secured, accessible, printers, kitchen, flexible_hours)
VALUES
('office1', TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE),
('office2', TRUE, TRUE, TRUE, FALSE, TRUE, TRUE, TRUE, FALSE, FALSE);
