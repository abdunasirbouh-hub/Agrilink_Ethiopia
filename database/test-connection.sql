# Test Database Connection Schema

-- Quick test to verify database connection and structure

-- Show all tables
SHOW TABLES;

-- Check users table structure
DESCRIBE users;

-- Check products table structure
DESCRIBE products;

-- Check system settings
SELECT * FROM system_settings;

-- Count records in each table
SELECT 'users' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 'products', COUNT(*) FROM products
UNION ALL
SELECT 'orders', COUNT(*) FROM orders
UNION ALL
SELECT 'delivery_assignments', COUNT(*) FROM delivery_assignments;
