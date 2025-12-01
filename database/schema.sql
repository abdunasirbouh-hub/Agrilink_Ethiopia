-- Agrilink Ethiopia - MySQL Database Schema
-- This schema supports: farmers, buyers, delivery personnel, admin
-- Features: automatic service fees, delivery assignment, data persistence

-- ============================================
-- 1. USERS TABLE
-- ============================================
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    location VARCHAR(100),
    type ENUM('farmer', 'buyer', 'delivery', 'admin') NOT NULL,
    approved BOOLEAN DEFAULT FALSE,
    suspended BOOLEAN DEFAULT FALSE,
    profile_picture TEXT,
    
    -- Farmer-specific fields
    farm_size VARCHAR(50),
    experience VARCHAR(50),
    
    -- Delivery-specific fields
    vehicle_type VARCHAR(50),
    license_number VARCHAR(50),
    availability_status ENUM('available', 'busy', 'offline') DEFAULT 'offline',
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    approved_at TIMESTAMP NULL,
    last_login TIMESTAMP NULL,
    
    INDEX idx_type (type),
    INDEX idx_email (email),
    INDEX idx_approved (approved)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================
-- 2. PRODUCTS TABLE (with automatic service fees)
-- ============================================
CREATE TABLE products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    farmer_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL,
    
    -- Pricing (automatic service fee calculation)
    base_price DECIMAL(10, 2) NOT NULL,
    service_fee_percentage DECIMAL(5, 2) DEFAULT 10.00,
    service_fee DECIMAL(10, 2) GENERATED ALWAYS AS (base_price * (service_fee_percentage / 100)) STORED,
    display_price DECIMAL(10, 2) GENERATED ALWAYS AS (base_price + (base_price * (service_fee_percentage / 100))) STORED,
    
    quantity VARCHAR(100) NOT NULL,
    location VARCHAR(100),
    harvest_date DATE,
    images JSON,
    
    -- Flags
    organic BOOLEAN DEFAULT FALSE,
    certified BOOLEAN DEFAULT FALSE,
    available BOOLEAN DEFAULT TRUE,
    
    -- Status
    status ENUM('pending', 'approved', 'rejected', 'suspended') DEFAULT 'pending',
    rejection_reason TEXT,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    approved_at TIMESTAMP NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (farmer_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_farmer (farmer_id),
    INDEX idx_category (category),
    INDEX idx_status (status),
    INDEX idx_available (available)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================
-- 3. ORDERS TABLE (with delivery assignment)
-- ============================================
CREATE TABLE orders (
    id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT NOT NULL,
    buyer_id INT NOT NULL,
    farmer_id INT NOT NULL,
    delivery_person_id INT NULL,
    
    -- Order details
    product_name VARCHAR(255),
    quantity DECIMAL(10, 2) NOT NULL,
    price_per_kg DECIMAL(10, 2) NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    
    -- Delivery info
    delivery_address TEXT,
    delivery_location VARCHAR(100),
    special_instructions TEXT,
    
    -- Status tracking
    status ENUM('new', 'processing', 'assigned', 'picked_up', 'in_transit', 'delivered', 'cancelled', 'refunded') DEFAULT 'new',
    payment_method VARCHAR(50),
    payment_status ENUM('pending', 'paid', 'refunded') DEFAULT 'pending',
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    assigned_at TIMESTAMP NULL,
    picked_up_at TIMESTAMP NULL,
    delivered_at TIMESTAMP NULL,
    cancelled_at TIMESTAMP NULL,
    
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (buyer_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (farmer_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (delivery_person_id) REFERENCES users(id) ON DELETE SET NULL,
    
    INDEX idx_buyer (buyer_id),
    INDEX idx_farmer (farmer_id),
    INDEX idx_delivery (delivery_person_id),
    INDEX idx_status (status),
    INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================
-- 4. OFFERS TABLE (quantity-only offers)
-- ============================================
CREATE TABLE offers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT NOT NULL,
    buyer_id INT NOT NULL,
    farmer_id INT NOT NULL,
    
    -- Offer details (no custom pricing, uses product price)
    quantity DECIMAL(10, 2) NOT NULL,
    price_per_kg DECIMAL(10, 2) NOT NULL, -- Locked to product display_price
    total_amount DECIMAL(10, 2) NOT NULL,
    
    delivery_preference VARCHAR(100),
    message TEXT,
    
    -- Status
    status ENUM('pending', 'accepted', 'rejected', 'expired') DEFAULT 'pending',
    farmer_response TEXT,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    responded_at TIMESTAMP NULL,
    expires_at TIMESTAMP NULL,
    
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (buyer_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (farmer_id) REFERENCES users(id) ON DELETE CASCADE,
    
    INDEX idx_product (product_id),
    INDEX idx_buyer (buyer_id),
    INDEX idx_farmer (farmer_id),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================
-- 5. DELIVERY ASSIGNMENTS TABLE
-- ============================================
CREATE TABLE delivery_assignments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT NOT NULL,
    delivery_person_id INT NOT NULL,
    
    -- Assignment details
    assignment_type ENUM('automatic', 'manual') DEFAULT 'automatic',
    pickup_location VARCHAR(255),
    delivery_location VARCHAR(255),
    estimated_distance DECIMAL(10, 2),
    delivery_fee DECIMAL(10, 2),
    
    -- Status tracking
    status ENUM('assigned', 'accepted', 'rejected', 'completed') DEFAULT 'assigned',
    notes TEXT,
    
    -- Timestamps
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    accepted_at TIMESTAMP NULL,
    completed_at TIMESTAMP NULL,
    
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (delivery_person_id) REFERENCES users(id) ON DELETE CASCADE,
    
    INDEX idx_order (order_id),
    INDEX idx_delivery_person (delivery_person_id),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================
-- 6. WISHLISTS TABLE
-- ============================================
CREATE TABLE wishlists (
    id INT PRIMARY KEY AUTO_INCREMENT,
    buyer_id INT NOT NULL,
    product_id INT NOT NULL,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (buyer_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    
    UNIQUE KEY unique_wishlist (buyer_id, product_id),
    INDEX idx_buyer (buyer_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================
-- 7. SYSTEM SETTINGS TABLE
-- ============================================
CREATE TABLE system_settings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    description VARCHAR(255),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_key (setting_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================
-- 8. NOTIFICATIONS TABLE
-- ============================================
CREATE TABLE notifications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT,
    related_id INT,
    related_type VARCHAR(50),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user (user_id),
    INDEX idx_read (is_read)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================
-- DEFAULT DATA
-- ============================================

-- Insert default system settings
INSERT INTO system_settings (setting_key, setting_value, description) VALUES
('service_fee_percentage', '10.00', 'Platform service fee percentage added to product prices'),
('auto_assign_delivery', 'true', 'Automatically assign deliveries to available delivery personnel'),
('farmer_approval_required', 'true', 'Require admin approval for new farmer accounts'),
('max_delivery_distance', '50', 'Maximum delivery distance in kilometers');

-- Insert default admin user (password: admin123)
-- Note: In production, use bcrypt hashed password
INSERT INTO users (name, email, password, phone, location, type, approved) VALUES
('Admin User', 'admin@agrilink.et', '$2a$10$YourHashedPasswordHere', '+251911234567', 'addis-ababa', 'admin', TRUE);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

-- Additional composite indexes for common queries
CREATE INDEX idx_products_category_status ON products(category, status);
CREATE INDEX idx_orders_status_created ON orders(status, created_at);
CREATE INDEX idx_users_type_approved ON users(type, approved);
