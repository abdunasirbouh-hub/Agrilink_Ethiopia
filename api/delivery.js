// Agrilink Ethiopia - Delivery API
// Delivery dashboard, assignment management, and status tracking

const express = require('express');
const router = express.Router();
const { query } = require('../config/database');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

// Get assigned deliveries for current delivery person
router.get('/my-deliveries', authenticateToken, authorizeRole('delivery'), async (req, res) => {
    try {
        const deliveries = await query(
            `SELECT o.*, 
                    p.title as product_title, p.images,
                    u_buyer.name as buyer_name, u_buyer.phone as buyer_phone, u_buyer.location as buyer_location,
                    u_farmer.name as farmer_name, u_farmer.phone as farmer_phone, u_farmer.location as farmer_location,
                    da.assignment_type, da.delivery_fee, da.notes
             FROM orders o
             LEFT JOIN products p ON o.product_id = p.id
             LEFT JOIN users u_buyer ON o.buyer_id = u_buyer.id
             LEFT JOIN users u_farmer ON o.farmer_id = u_farmer.id
             LEFT JOIN delivery_assignments da ON o.id = da.order_id
             WHERE o.delivery_person_id = ?
             ORDER BY o.created_at DESC`,
            [req.user.id]
        );

        const deliveriesWithImages = deliveries.map(d => ({
            ...d,
            product_images: d.images ? JSON.parse(d.images) : []
        }));

        res.json({
            success: true,
            count: deliveriesWithImages.length,
            deliveries: deliveriesWithImages
        });

    } catch (error) {
        console.error('Get deliveries error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch deliveries'
        });
    }
});

// Update delivery person availability status
router.patch('/availability', authenticateToken, authorizeRole('delivery'), async (req, res) => {
    try {
        const { status } = req.body;

        const validStatuses = ['available', 'busy', 'offline'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status. Must be: available, busy, or offline'
            });
        }

        await query(
            'UPDATE users SET availability_status = ? WHERE id = ?',
            [status, req.user.id]
        );

        res.json({
            success: true,
            message: 'Availability status updated successfully',
            status
        });

    } catch (error) {
        console.error('Update availability error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update availability'
        });
    }
});

// Update delivery status
router.patch('/delivery/:orderId/status', authenticateToken, authorizeRole('delivery'), async (req, res) => {
    try {
        const { status } = req.body;

        // Verify this delivery belongs to the current delivery person
        const orders = await query(
            'SELECT * FROM orders WHERE id = ? AND delivery_person_id = ?',
            [req.params.orderId, req.user.id]
        );

        if (orders.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Delivery not found or not assigned to you'
            });
        }

        const validStatuses = ['picked_up', 'in_transit', 'delivered'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status for delivery'
            });
        }

        // Update order status
        let updateQuery = 'UPDATE orders SET status = ?';
        const params = [status];

        if (status === 'picked_up') {
            updateQuery += ', picked_up_at = NOW()';
        } else if (status === 'delivered') {
            updateQuery += ', delivered_at = NOW()';
            // Update delivery assignment
            await query(
                'UPDATE delivery_assignments SET status = ?, completed_at = NOW() WHERE order_id = ?',
                ['completed', req.params.orderId]
            );
            // Set delivery person back to available
            await query(
                'UPDATE users SET availability_status = ? WHERE id = ?',
                ['available', req.user.id]
            );
        }

        updateQuery += ' WHERE id = ?';
        params.push(req.params.orderId);

        await query(updateQuery, params);

        res.json({
            success: true,
            message: 'Delivery status updated successfully',
            status
        });

    } catch (error) {
        console.error('Update delivery status error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update delivery status'
        });
    }
});

// Get delivery statistics
router.get('/stats', authenticateToken, authorizeRole('delivery'), async (req, res) => {
    try {
        // Total deliveries
        const totalDeliveries = await query(
            'SELECT COUNT(*) as count FROM orders WHERE delivery_person_id = ?',
            [req.user.id]
        );

        // Completed deliveries
        const completedDeliveries = await query(
            'SELECT COUNT(*) as count FROM orders WHERE delivery_person_id = ? AND status = ?',
            [req.user.id, 'delivered']
        );

        // Active deliveries
        const activeDeliveries = await query(
            `SELECT COUNT(*) as count FROM orders 
             WHERE delivery_person_id = ? 
             AND status IN ('assigned', 'picked_up', 'in_transit')`,
            [req.user.id]
        );

        // Total earnings (sum of delivery fees)
        const earnings = await query(
            `SELECT COALESCE(SUM(da.delivery_fee), 0) as total
             FROM delivery_assignments da
             WHERE da.delivery_person_id = ? AND da.status = 'completed'`,
            [req.user.id]
        );

        res.json({
            success: true,
            stats: {
                total_deliveries: totalDeliveries[0].count,
                completed_deliveries: completedDeliveries[0].count,
                active_deliveries: activeDeliveries[0].count,
                total_earnings: earnings[0].total || 0
            }
        });

    } catch (error) {
        console.error('Get delivery stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch statistics'
        });
    }
});

// Accept delivery assignment
router.post('/assignment/:assignmentId/accept', authenticateToken, authorizeRole('delivery'), async (req, res) => {
    try {
        const assignments = await query(
            'SELECT * FROM delivery_assignments WHERE id = ? AND delivery_person_id = ?',
            [req.params.assignmentId, req.user.id]
        );

        if (assignments.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Assignment not found'
            });
        }

        await query(
            'UPDATE delivery_assignments SET status = ?, accepted_at = NOW() WHERE id = ?',
            ['accepted', req.params.assignmentId]
        );

        res.json({
            success: true,
            message: 'Delivery assignment accepted'
        });

    } catch (error) {
        console.error('Accept assignment error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to accept assignment'
        });
    }
});

// Reject delivery assignment
router.post('/assignment/:assignmentId/reject', authenticateToken, authorizeRole('delivery'), async (req, res) => {
    try {
        const assignments = await query(
            'SELECT * FROM delivery_assignments WHERE id = ? AND delivery_person_id = ?',
            [req.params.assignmentId, req.user.id]
        );

        if (assignments.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Assignment not found'
            });
        }

        const assignment = assignments[0];

        // Update assignment status
        await query(
            'UPDATE delivery_assignments SET status = ? WHERE id = ?',
            ['rejected', req.params.assignmentId]
        );

        // Clear delivery from order and reset status
        await query(
            'UPDATE orders SET delivery_person_id = NULL, status = ? WHERE id = ?',
            ['processing', assignment.order_id]
        );

        // Set delivery person back to available
        await query(
            'UPDATE users SET availability_status = ? WHERE id = ?',
            ['available', req.user.id]
        );

        res.json({
            success: true,
            message: 'Delivery assignment rejected'
        });

    } catch (error) {
        console.error('Reject assignment error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to reject assignment'
        });
    }
});

module.exports = router;
