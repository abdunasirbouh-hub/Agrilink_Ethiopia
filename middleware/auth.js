// Agrilink Ethiopia - Authentication Middleware
// JWT token verification and user role checking

const jwt = require('jsonwebtoken');
const { query } = require('../config/database');

// Verify JWT token
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        return res.status(401).json({ 
            success: false, 
            message: 'Access denied. No token provided.' 
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({ 
            success: false, 
            message: 'Invalid or expired token.' 
        });
    }
}

// Check if user has specific role
function authorizeRole(...roles) {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ 
                success: false, 
                message: 'Unauthorized' 
            });
        }

        if (!roles.includes(req.user.type)) {
            return res.status(403).json({ 
                success: false, 
                message: `Access denied. Required role: ${roles.join(' or ')}` 
            });
        }

        next();
    };
}

// Check if farmer is approved
async function checkFarmerApproval(req, res, next) {
    if (req.user.type === 'farmer') {
        try {
            const [farmer] = await query(
                'SELECT approved FROM users WHERE id = ?',
                [req.user.id]
            );

            if (!farmer || !farmer.approved) {
                return res.status(403).json({
                    success: false,
                    message: 'Your farmer account is pending admin approval.'
                });
            }
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Error checking approval status'
            });
        }
    }
    next();
}

module.exports = {
    authenticateToken,
    authorizeRole,
    checkFarmerApproval
};
