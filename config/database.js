// Agrilink Ethiopia - Database Configuration
// MySQL connection pool and query helpers

const mysql = require('mysql2/promise');
require('dotenv').config();

// Create connection pool
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'agrilink_ethiopia',
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0
});

// Test database connection
async function testConnection() {
    try {
        const connection = await pool.getConnection();
        console.log('✅ Database connected successfully');
        connection.release();
        return true;
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        return false;
    }
}

// Query helper function
async function query(sql, params) {
    try {
        const [results] = await pool.execute(sql, params);
        return results;
    } catch (error) {
        console.error('Database query error:', error);
        throw error;
    }
}

// Get service fee percentage from settings
async function getServiceFeePercentage() {
    try {
        const result = await query(
            'SELECT setting_value FROM system_settings WHERE setting_key = ?',
            ['service_fee_percentage']
        );
        return result.length > 0 ? parseFloat(result[0].setting_value) : 10.00;
    } catch (error) {
        console.error('Error fetching service fee:', error);
        return 10.00; // Default fallback
    }
}

// Calculate prices with service fee
function calculatePricesWithFee(basePrice, feePercentage = 10.00) {
    const serviceFee = (basePrice * feePercentage) / 100;
    const displayPrice = basePrice + serviceFee;
    return {
        base_price: parseFloat(basePrice.toFixed(2)),
        service_fee: parseFloat(serviceFee.toFixed(2)),
        display_price: parseFloat(displayPrice.toFixed(2)),
        service_fee_percentage: feePercentage
    };
}

module.exports = {
    pool,
    query,
    testConnection,
    getServiceFeePercentage,
    calculatePricesWithFee
};
