// Agrilink Ethiopia - Products API
// Product listing, creation, approval with automatic service fees

const express = require('express');
const router = express.Router();
const { query, calculatePricesWithFee, getServiceFeePercentage } = require('../config/database');
const { authenticateToken, authorizeRole, checkFarmerApproval } = require('../middleware/auth');

// Get all approved products (public)
router.get('/', async (req, res) => {
    try {
        const { category, location, status = 'approved' } = req.query;
        
        let sql = `
            SELECT p.*, u.name as farmer_name, u.phone as farmer_phone, u.location as farmer_location,
                   p.base_price, p.service_fee, p.display_price, p.service_fee_percentage
            FROM products p
            JOIN users u ON p.farmer_id = u.id
            WHERE p.available = 1
        `;
        const params = [];

        if (status) {
            sql += ' AND p.status = ?';
            params.push(status);
        }

        if (category) {
            sql += ' AND p.category = ?';
            params.push(category);
        }

        if (location) {
            sql += ' AND p.location = ?';
            params.push(location);
        }

        sql += ' ORDER BY p.created_at DESC';

        const products = await query(sql, params);

        // Parse JSON images
        const productsWithImages = products.map(p => ({
            ...p,
            images: p.images ? JSON.parse(p.images) : [],
            farmer: {
                id: p.farmer_id,
                name: p.farmer_name,
                phone: p.farmer_phone,
                location: p.farmer_location,
                rating: 4.5 // TODO: Calculate from reviews
            }
        }));

        res.json({
            success: true,
            count: productsWithImages.length,
            products: productsWithImages
        });

    } catch (error) {
        console.error('Get products error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch products'
        });
    }
});

// Get single product by ID
router.get('/:id', async (req, res) => {
    try {
        const products = await query(
            `SELECT p.*, u.name as farmer_name, u.phone as farmer_phone, u.email as farmer_email, u.location as farmer_location
             FROM products p
             JOIN users u ON p.farmer_id = u.id
             WHERE p.id = ?`,
            [req.params.id]
        );

        if (products.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        const product = {
            ...products[0],
            images: products[0].images ? JSON.parse(products[0].images) : [],
            farmer: {
                id: products[0].farmer_id,
                name: products[0].farmer_name,
                phone: products[0].farmer_phone,
                email: products[0].farmer_email,
                location: products[0].farmer_location,
                rating: 4.5
            }
        };

        res.json({
            success: true,
            product
        });

    } catch (error) {
        console.error('Get product error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch product'
        });
    }
});

// Create new product (farmers only)
router.post('/', authenticateToken, authorizeRole('farmer'), checkFarmerApproval, async (req, res) => {
    try {
        const { title, description, category, basePrice, quantity, location, harvestDate, organic, certified, images } = req.body;

        if (!title || !category || !basePrice || !quantity) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields'
            });
        }

        // Get service fee percentage from settings
        const serviceFeePercentage = await getServiceFeePercentage();

        // Calculate prices with service fee
        const prices = calculatePricesWithFee(parseFloat(basePrice), serviceFeePercentage);

        // Insert product
        const result = await query(
            `INSERT INTO products 
             (farmer_id, title, description, category, base_price, service_fee_percentage, quantity, location, harvest_date, organic, certified, images, status, created_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', NOW())`,
            [
                req.user.id,
                title,
                description || '',
                category,
                prices.base_price,
                serviceFeePercentage,
                quantity,
                location,
                harvestDate || null,
                organic ? 1 : 0,
                certified ? 1 : 0,
                JSON.stringify(images || [])
            ]
        );

        res.status(201).json({
            success: true,
            message: 'Product created successfully and pending approval',
            productId: result.insertId,
            pricing: prices
        });

    } catch (error) {
        console.error('Create product error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create product'
        });
    }
});

// Update product (farmer only, own products)
router.put('/:id', authenticateToken, authorizeRole('farmer'), async (req, res) => {
    try {
        // Check ownership
        const products = await query('SELECT farmer_id FROM products WHERE id = ?', [req.params.id]);
        
        if (products.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        if (products[0].farmer_id !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'You can only update your own products'
            });
        }

        const { title, description, quantity, basePrice, location, available, images } = req.body;

        let updateFields = [];
        let updateValues = [];

        if (title) {
            updateFields.push('title = ?');
            updateValues.push(title);
        }
        if (description) {
            updateFields.push('description = ?');
            updateValues.push(description);
        }
        if (quantity) {
            updateFields.push('quantity = ?');
            updateValues.push(quantity);
        }
        if (basePrice) {
            const serviceFeePercentage = await getServiceFeePercentage();
            updateFields.push('base_price = ?, service_fee_percentage = ?');
            updateValues.push(parseFloat(basePrice), serviceFeePercentage);
        }
        if (location) {
            updateFields.push('location = ?');
            updateValues.push(location);
        }
        if (typeof available !== 'undefined') {
            updateFields.push('available = ?');
            updateValues.push(available ? 1 : 0);
        }
        if (images) {
            updateFields.push('images = ?');
            updateValues.push(JSON.stringify(images));
        }

        if (updateFields.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No fields to update'
            });
        }

        updateFields.push('updated_at = NOW()');
        updateValues.push(req.params.id);

        await query(
            `UPDATE products SET ${updateFields.join(', ')} WHERE id = ?`,
            updateValues
        );

        res.json({
            success: true,
            message: 'Product updated successfully'
        });

    } catch (error) {
        console.error('Update product error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update product'
        });
    }
});

// Delete product (farmer only, own products)
router.delete('/:id', authenticateToken, authorizeRole('farmer'), async (req, res) => {
    try {
        // Check ownership
        const products = await query('SELECT farmer_id FROM products WHERE id = ?', [req.params.id]);
        
        if (products.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        if (products[0].farmer_id !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'You can only delete your own products'
            });
        }

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

// Get farmer's own products
router.get('/farmer/my-products', authenticateToken, authorizeRole('farmer'), async (req, res) => {
    try {
        const products = await query(
            'SELECT * FROM products WHERE farmer_id = ? ORDER BY created_at DESC',
            [req.user.id]
        );

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
        console.error('Get farmer products error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch products'
        });
    }
});

module.exports = router;
