// Agrilink Ethiopia - Users API
// User profile and general user operations

const express = require('express');
const router = express.Router();
const { query } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

// Get user by ID (public info only)
router.get('/:id', async (req, res) => {
    try {
        const users = await query(
            `SELECT id, name, location, type, created_at, profile_picture
             FROM users 
             WHERE id = ?`,
            [req.params.id]
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
        console.error('Get user error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch user'
        });
    }
});

module.exports = router;
