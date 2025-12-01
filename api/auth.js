// Agrilink Ethiopia - Authentication API
// User registration, login, and token management

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { query } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

// Register new user
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, phone, location, type, farmSize, experience, vehicleType, licenseNumber } = req.body;

        // Validation
        if (!name || !email || !password || !type) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields'
            });
        }

        // Check if user already exists
        const existingUser = await query('SELECT id FROM users WHERE email = ?', [email]);
        if (existingUser.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Email already registered'
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Auto-approve buyers and delivery, farmers need admin approval
        const approved = (type === 'buyer' || type === 'delivery') ? 1 : 0;

        // Insert user
        const result = await query(
            `INSERT INTO users (name, email, password, phone, location, type, approved, farm_size, experience, vehicle_type, license_number, created_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
            [name, email, hashedPassword, phone, location, type, approved, farmSize || null, experience || null, vehicleType || null, licenseNumber || null]
        );

        res.status(201).json({
            success: true,
            message: type === 'farmer' 
                ? 'Registration successful! Your account is pending admin approval.' 
                : 'Registration successful! You can now login.',
            userId: result.insertId
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Registration failed. Please try again.'
        });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and password'
            });
        }

        // Find user
        const users = await query('SELECT * FROM users WHERE email = ?', [email]);
        
        if (users.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        const user = users[0];

        // Verify password
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Check if farmer is approved
        if (user.type === 'farmer' && !user.approved) {
            return res.status(403).json({
                success: false,
                message: 'Your farmer account is pending admin approval. Please wait for verification.'
            });
        }

        // Check if suspended
        if (user.suspended) {
            return res.status(403).json({
                success: false,
                message: 'Your account has been suspended. Please contact admin.'
            });
        }

        // Update last login
        await query('UPDATE users SET last_login = NOW() WHERE id = ?', [user.id]);

        // Generate JWT token
        const token = jwt.sign(
            { 
                id: user.id, 
                email: user.email, 
                type: user.type,
                name: user.name
            },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
        );

        // Remove password from response
        delete user.password;

        res.json({
            success: true,
            message: 'Login successful',
            token,
            user
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Login failed. Please try again.'
        });
    }
});

// Get current user profile
router.get('/profile', authenticateToken, async (req, res) => {
    try {
        const users = await query(
            'SELECT id, name, email, phone, location, type, approved, profile_picture, farm_size, experience, vehicle_type, availability_status, created_at FROM users WHERE id = ?',
            [req.user.id]
        );

        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            user: users[0]
        });

    } catch (error) {
        console.error('Profile fetch error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch profile'
        });
    }
});

// Update profile
router.put('/profile', authenticateToken, async (req, res) => {
    try {
        const { name, phone, location, farmSize, experience } = req.body;

        await query(
            'UPDATE users SET name = ?, phone = ?, location = ?, farm_size = ?, experience = ? WHERE id = ?',
            [name, phone, location, farmSize || null, experience || null, req.user.id]
        );

        res.json({
            success: true,
            message: 'Profile updated successfully'
        });

    } catch (error) {
        console.error('Profile update error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update profile'
        });
    }
});

// Verify token (for frontend to check if token is still valid)
router.get('/verify', authenticateToken, (req, res) => {
    res.json({
        success: true,
        user: req.user
    });
});

module.exports = router;
