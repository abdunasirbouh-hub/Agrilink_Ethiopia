// Agrilink Ethiopia - Orders API
// Order creation, tracking, and automatic delivery assignment

const express = require('express');
const router = express.Router();
const { query } = require('../config/database');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

// Create new order (buyers only)
router.post('/', authenticateToken, authorizeRole('buyer'), async (req, res) => {
    try {
        const { productId, quantity, deliveryAddress, deliveryLocation, specialInstructions } = req.body;

        if (!productId || !quantity) {
            return res.status(400).json({
                success: false,
                message: 'Please provide product ID and quantity'
            });
        }

        // Get product details
        const products = await query(
            'SELECT * FROM products WHERE id = ? AND status = ? AND available = 1',
            [productId, 'approved']
        );

        if (products.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Product not found or not available'
            });
        }

        const product = products[0];
        const totalPrice = product.display_price * quantity;

        // Create order
        const orderResult = await query(
            `INSERT INTO orders 
             (product_id, buyer_id, farmer_id, product_name, quantity, price_per_kg, total_price, delivery_address, delivery_location, special_instructions, status, created_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'new', NOW())`,
            [productId, req.user.id, product.farmer_id, product.title, quantity, product.display_price, totalPrice, deliveryAddress, deliveryLocation, specialInstructions]
        );

        const orderId = orderResult.insertId;

        // Auto-assign delivery if enabled
        if (process.env.AUTO_ASSIGN_DELIVERY === 'true') {
            await autoAssignDelivery(orderId, deliveryLocation || product.location);
        }

        res.status(201).json({
            success: true,
            message: 'Order created successfully',
            orderId,
            totalPrice
        });

    } catch (error) {
        console.error('Create order error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create order'
        });
    }
});

// Auto-assign delivery to available delivery personnel
async function autoAssignDelivery(orderId, location) {
    try {
        // Find available delivery personnel in the same location
        const deliveryPersonnel = await query(
            `SELECT id FROM users 
             WHERE type = 'delivery' 
             AND availability_status = 'available' 
             AND location = ? 
             AND approved = 1
             LIMIT 1`,
            [location]
        );

        if (deliveryPersonnel.length > 0) {
            const deliveryPersonId = deliveryPersonnel[0].id;

            // Update order with delivery assignment
            await query(
                'UPDATE orders SET delivery_person_id = ?, status = ?, assigned_at = NOW() WHERE id = ?',
                [deliveryPersonId, 'assigned', orderId]
            );

            // Create delivery assignment record
            await query(
                `INSERT INTO delivery_assignments 
                 (order_id, delivery_person_id, assignment_type, delivery_location, status, assigned_at)
                 VALUES (?, ?, 'automatic', ?, 'assigned', NOW())`,
                [orderId, deliveryPersonId, location]
            );

            // Update delivery person status to busy
            await query(
                'UPDATE users SET availability_status = ? WHERE id = ?',
                ['busy', deliveryPersonId]
            );

            console.log(`✅ Order ${orderId} auto-assigned to delivery person ${deliveryPersonId}`);
        } else {
            console.log(`⚠️  No available delivery personnel found for order ${orderId}`);
        }
    } catch (error) {
        console.error('Auto-assign delivery error:', error);
    }
}

// Get buyer's orders
router.get('/my-orders', authenticateToken, authorizeRole('buyer'), async (req, res) => {
    try {
        const orders = await query(
            `SELECT o.*, p.title as product_title, p.images,
                    u_farmer.name as farmer_name, u_farmer.phone as farmer_phone,
                    u_delivery.name as delivery_person_name, u_delivery.phone as delivery_person_phone
             FROM orders o
             LEFT JOIN products p ON o.product_id = p.id
             LEFT JOIN users u_farmer ON o.farmer_id = u_farmer.id
             LEFT JOIN users u_delivery ON o.delivery_person_id = u_delivery.id
             WHERE o.buyer_id = ?
             ORDER BY o.created_at DESC`,
            [req.user.id]
        );

        const ordersWithImages = orders.map(o => ({
            ...o,
            product_images: o.images ? JSON.parse(o.images) : []
        }));

        res.json({
            success: true,
            count: ordersWithImages.length,
            orders: ordersWithImages
        });

    } catch (error) {
        console.error('Get buyer orders error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch orders'
        });
    }
});

// Get farmer's orders
router.get('/farmer/orders', authenticateToken, authorizeRole('farmer'), async (req, res) => {
    try {
        const orders = await query(
            `SELECT o.*, 
                    u_buyer.name as buyer_name, u_buyer.phone as buyer_phone,
                    u_delivery.name as delivery_person_name
             FROM orders o
             LEFT JOIN users u_buyer ON o.buyer_id = u_buyer.id
             LEFT JOIN users u_delivery ON o.delivery_person_id = u_delivery.id
             WHERE o.farmer_id = ?
             ORDER BY o.created_at DESC`,
            [req.user.id]
        );

        res.json({
            success: true,
            count: orders.length,
            orders
        });

    } catch (error) {
        console.error('Get farmer orders error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch orders'
        });
    }
});

// Get single order details
router.get('/:id', authenticateToken, async (req, res) => {
    try {
        const orders = await query(
            `SELECT o.*, p.title as product_title, p.images,
                    u_buyer.name as buyer_name, u_buyer.phone as buyer_phone,
                    u_farmer.name as farmer_name, u_farmer.phone as farmer_phone,
                    u_delivery.name as delivery_person_name, u_delivery.phone as delivery_person_phone
             FROM orders o
             LEFT JOIN products p ON o.product_id = p.id
             LEFT JOIN users u_buyer ON o.buyer_id = u_buyer.id
             LEFT JOIN users u_farmer ON o.farmer_id = u_farmer.id
             LEFT JOIN users u_delivery ON o.delivery_person_id = u_delivery.id
             WHERE o.id = ?`,
            [req.params.id]
        );

        if (orders.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        const order = orders[0];

        // Check authorization
        if (req.user.type !== 'admin' && 
            order.buyer_id !== req.user.id && 
            order.farmer_id !== req.user.id && 
            order.delivery_person_id !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Access denied'
            });
        }

        res.json({
            success: true,
            order: {
                ...order,
                product_images: order.images ? JSON.parse(order.images) : []
            }
        });

    } catch (error) {
        console.error('Get order error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch order'
        });
    }
});

// Update order status
router.patch('/:id/status', authenticateToken, async (req, res) => {
    try {
        const { status } = req.body;

        const validStatuses = ['new', 'processing', 'assigned', 'picked_up', 'in_transit', 'delivered', 'cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status'
            });
        }

        // Get order to check authorization
        const orders = await query('SELECT * FROM orders WHERE id = ?', [req.params.id]);
        
        if (orders.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        const order = orders[0];

        // Authorization rules
        const canUpdate = 
            req.user.type === 'admin' ||
            (req.user.type === 'farmer' && order.farmer_id === req.user.id) ||
            (req.user.type === 'buyer' && order.buyer_id === req.user.id && status === 'cancelled') ||
            (req.user.type === 'delivery' && order.delivery_person_id === req.user.id);

        if (!canUpdate) {
            return res.status(403).json({
                success: false,
                message: 'Access denied'
            });
        }

        // Update order status
        let updateQuery = 'UPDATE orders SET status = ?';
        const params = [status];

        if (status === 'picked_up') {
            updateQuery += ', picked_up_at = NOW()';
        } else if (status === 'delivered') {
            updateQuery += ', delivered_at = NOW()';
            // Set delivery person back to available
            if (order.delivery_person_id) {
                await query(
                    'UPDATE users SET availability_status = ? WHERE id = ?',
                    ['available', order.delivery_person_id]
                );
            }
        } else if (status === 'cancelled') {
            updateQuery += ', cancelled_at = NOW()';
            // Set delivery person back to available if assigned
            if (order.delivery_person_id) {
                await query(
                    'UPDATE users SET availability_status = ? WHERE id = ?',
                    ['available', order.delivery_person_id]
                );
            }
        }

        updateQuery += ' WHERE id = ?';
        params.push(req.params.id);

        await query(updateQuery, params);

        res.json({
            success: true,
            message: 'Order status updated successfully'
        });

    } catch (error) {
        console.error('Update order status error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update order status'
        });
    }
});

// Cancel order (buyer only)
router.post('/:id/cancel', authenticateToken, authorizeRole('buyer'), async (req, res) => {
    try {
        const orders = await query('SELECT * FROM orders WHERE id = ? AND buyer_id = ?', [req.params.id, req.user.id]);
        
        if (orders.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        const order = orders[0];

        if (order.status !== 'new' && order.status !== 'processing') {
            return res.status(400).json({
                success: false,
                message: 'Order cannot be cancelled in current status'
            });
        }

        await query(
            'UPDATE orders SET status = ?, cancelled_at = NOW() WHERE id = ?',
            ['cancelled', req.params.id]
        );

        // Free up delivery person if assigned
        if (order.delivery_person_id) {
            await query(
                'UPDATE users SET availability_status = ? WHERE id = ?',
                ['available', order.delivery_person_id]
            );
        }

        res.json({
            success: true,
            message: 'Order cancelled successfully'
        });

    } catch (error) {
        console.error('Cancel order error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to cancel order'
        });
    }
});

module.exports = router;
