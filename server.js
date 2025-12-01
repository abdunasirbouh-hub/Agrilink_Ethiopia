// Agrilink Ethiopia - Main Server
// Express server with MySQL database integration

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const { testConnection } = require('./config/database');

// Import routes
const authRoutes = require('./api/auth');
const productRoutes = require('./api/products');
const orderRoutes = require('./api/orders');
const userRoutes = require('./api/users');
const deliveryRoutes = require('./api/delivery');
const adminRoutes = require('./api/admin');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
    origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : '*',
    credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(__dirname));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/delivery', deliveryRoutes);
app.use('/api/admin', adminRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        success: true, 
        message: 'Agrilink Ethiopia API is running',
        timestamp: new Date().toISOString()
    });
});

// Root endpoint
app.get('/api', (req, res) => {
    res.json({
        success: true,
        message: 'Welcome to Agrilink Ethiopia API',
        version: '2.0.0',
        endpoints: {
            auth: '/api/auth',
            products: '/api/products',
            orders: '/api/orders',
            users: '/api/users',
            delivery: '/api/delivery',
            admin: '/api/admin'
        }
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err : {}
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint not found'
    });
});

// Start server
async function startServer() {
    try {
        // Test database connection
        const dbConnected = await testConnection();
        
        if (!dbConnected) {
            console.error('⚠️  Server starting without database connection');
            console.error('⚠️  Please check your database configuration in .env');
        }

        // Start listening
        app.listen(PORT, () => {
            console.log('');
            console.log('═══════════════════════════════════════════════');
            console.log('  🌾 Agrilink Ethiopia API Server');
            console.log('═══════════════════════════════════════════════');
            console.log(`  🚀 Server running on: http://localhost:${PORT}`);
            console.log(`  📊 Environment: ${process.env.NODE_ENV || 'development'}`);
            console.log(`  🗄️  Database: ${dbConnected ? 'Connected' : 'Not Connected'}`);
            console.log('═══════════════════════════════════════════════');
            console.log('');
            console.log('  API Endpoints:');
            console.log(`  • Authentication: http://localhost:${PORT}/api/auth`);
            console.log(`  • Products:       http://localhost:${PORT}/api/products`);
            console.log(`  • Orders:         http://localhost:${PORT}/api/orders`);
            console.log(`  • Delivery:       http://localhost:${PORT}/api/delivery`);
            console.log(`  • Admin:          http://localhost:${PORT}/api/admin`);
            console.log('');
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    process.exit(1);
});

process.on('unhandledRejection', (error) => {
    console.error('Unhandled Rejection:', error);
    process.exit(1);
});

// Start the server
startServer();

module.exports = app;
