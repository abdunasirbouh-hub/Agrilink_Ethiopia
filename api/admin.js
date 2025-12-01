// Agrilink Ethiopia - Admin API
// Admin operations for user management, product approval, system settings

const express = require('express');
const router = express.Router();
const { query, getServiceFeePercentage } = require('../config/database');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

// All routes require admin role
router.use(authenticateToken, authorizeRole('admin'));

// Get all users
router.get('/users', async (req, res) => {
    try {
        const { type } = req.query;
        
        let sql = 'SELECT id, name, email, phone, location, type, approved, suspended, created_at FROM users WHERE 1=1';
        const params = [];

        if (type) {
            sql += ' AND type = ?';
            params.push(type);
        }

        sql += ' ORDER BY created_at DESC';

        const users = await query(sql, params);

        res.json({
            success: true,
            count: users.length,
            users
        });

    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch users'
        });
    }
});

// Get all products (including pending)
router.get('/products', async (req, res) => {
    try {
        const { status } = req.query;
        
        let sql = `
            SELECT p.*, u.name as farmer_name, u.email as farmer_email
            FROM products p
            JOIN users u ON p.farmer_id = u.id
            WHERE 1=1
        `;
        const params = [];

        if (status) {
            sql += ' AND p.status = ?';
            params.push(status);
        }

        sql += ' ORDER BY p.created_at DESC';

        const products = await query(sql, params);

        const productsWithImages = products.map(p => ({
            ...p,
            images: p.images ? JSON.parse(p.images) : []
        }));

        res.json({
            success: true,
            count: productsWithImages.length,
            products: productsWithImages
        });

    } catch (error) {
        console.error('Get admin products error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch products'
        });
    }
});

// Get all orders
router.get('/orders', async (req, res) => {
    try {
        const orders = await query(
            `SELECT o.*, 
                    p.title as product_title,
                    u_buyer.name as buyer_name,
                    u_farmer.name as farmer_name,
                    u_delivery.name as delivery_person_name
             FROM orders o
             LEFT JOIN products p ON o.product_id = p.id
             LEFT JOIN users u_buyer ON o.buyer_id = u_buyer.id
             LEFT JOIN users u_farmer ON o.farmer_id = u_farmer.id
             LEFT JOIN users u_delivery ON o.delivery_person_id = u_delivery.id
             ORDER BY o.created_at DESC`
        );

        res.json({
            success: true,
            count: orders.length,
            orders
        });

    } catch (error) {
        console.error('Get admin orders error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch orders'
        });
    }
});

// Approve farmer
router.patch('/users/:id/approve', async (req, res) => {
    try {
        await query(
            'UPDATE users SET approved = 1, approved_at = NOW() WHERE id = ? AND type = ?',
            [req.params.id, 'farmer']
        );

        res.json({
            success: true,
            message: 'Farmer approved successfully'
        });

    } catch (error) {
        console.error('Approve farmer error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to approve farmer'
        });
    }
});

// Suspend user
router.patch('/users/:id/suspend', async (req, res) => {
    try {
        await query(
            'UPDATE users SET suspended = 1 WHERE id = ?',
            [req.params.id]
        );

        res.json({
            success: true,
            message: 'User suspended successfully'
        });

    } catch (error) {
        console.error('Suspend user error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to suspend user'
        });
    }
});

// Unsuspend user
router.patch('/users/:id/unsuspend', async (req, res) => {
    try {
        await query(
            'UPDATE users SET suspended = 0 WHERE id = ?',
            [req.params.id]
        );

        res.json({
            success: true,
            message: 'User unsuspended successfully'
        });

    } catch (error) {
        console.error('Unsuspend user error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to unsuspend user'
        });
    }
});

// Delete user
router.delete('/users/:id', async (req, res) => {
    try {
        await query('DELETE FROM users WHERE id = ?', [req.params.id]);

        res.json({
            success: true,
            message: 'User deleted successfully'
        });

    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete user'
        });
    }
});

// Approve product
router.patch('/products/:id/approve', async (req, res) => {
    try {
        await query(
            'UPDATE products SET status = ?, approved_at = NOW() WHERE id = ?',
            ['approved', req.params.id]
        );

        res.json({
            success: true,
            message: 'Product approved successfully'
        });

    } catch (error) {
        console.error('Approve product error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to approve product'
        });
    }
});

// Reject product
router.patch('/products/:id/reject', async (req, res) => {
    try {
        const { reason } = req.body;

        await query(
            'UPDATE products SET status = ?, rejection_reason = ? WHERE id = ?',
            ['rejected', reason || 'No reason provided', req.params.id]
        );

        res.json({
            success: true,
            message: 'Product rejected'
        });

    } catch (error) {
        console.error('Reject product error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to reject product'
        });
    }
});

// Suspend product
router.patch('/products/:id/suspend', async (req, res) => {
    try {
        await query(
            'UPDATE products SET status = ? WHERE id = ?',
            ['suspended', req.params.id]
        );

        res.json({
            success: true,
            message: 'Product suspended successfully'
        });

    } catch (error) {
        console.error('Suspend product error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to suspend product'
        });
    }
});

// Delete product
router.delete('/products/:id', async (req, res) => {
    try {
        await query('DELETE FROM products WHERE id = ?', [req.params.id]);

        res.json({
            success: true,
            message: 'Product deleted successfully'
        });

    } catch (error) {
        console.error('Delete product error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete product'
        });
    }
});

// Get dashboard statistics
router.get('/stats', async (req, res) => {
    try {
        const [totalUsers] = await query('SELECT COUNT(*) as count FROM users');
        const [totalProducts] = await query('SELECT COUNT(*) as count FROM products');
        const [totalOrders] = await query('SELECT COUNT(*) as count FROM orders');
        const [pendingFarmers] = await query('SELECT COUNT(*) as count FROM users WHERE type = ? AND approved = 0', ['farmer']);
        const [pendingProducts] = await query('SELECT COUNT(*) as count FROM products WHERE status = ?', ['pending']);
        const [activeFarmers] = await query('SELECT COUNT(*) as count FROM users WHERE type = ? AND approved = 1', ['farmer']);
        const [activeDelivery] = await query('SELECT COUNT(*) as count FROM users WHERE type = ? AND availability_status = ?', ['delivery', 'available']);

        res.json({
            success: true,
            stats: {
                total_users: totalUsers.count,
                total_products: totalProducts.count,
                total_orders: totalOrders.count,
                pending_farmers: pendingFarmers.count,
                pending_products: pendingProducts.count,
                active_farmers: activeFarmers.count,
                available_delivery: activeDelivery.count
            }
        });

    } catch (error) {
        console.error('Get stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch statistics'
        });
    }
});

// Get system settings
router.get('/settings', async (req, res) => {
    try {
        const settings = await query('SELECT * FROM system_settings');
        
        const settingsObj = {};
        settings.forEach(s => {
            settingsObj[s.setting_key] = s.setting_value;
        });

        res.json({
            success: true,
            settings: settingsObj
        });

    } catch (error) {
        console.error('Get settings error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch settings'
        });
    }
});

// Update system setting
router.patch('/settings/:key', async (req, res) => {
    try {
        const { value } = req.body;

        await query(
            'UPDATE system_settings SET setting_value = ?, updated_at = NOW() WHERE setting_key = ?',
            [value, req.params.key]
        );

        res.json({
            success: true,
            message: 'Setting updated successfully'
        });

    } catch (error) {
        console.error('Update setting error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update setting'
        });
    }
});

module.exports = router;
