# Agrilink Ethiopia - Setup & Deployment Guide

## 🚀 Quick Start Guide

This guide will help you set up the complete Agrilink Ethiopia system with MySQL database, backend API, and all new features.

## Prerequisites

Before starting, make sure you have:

1. **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
2. **MySQL Server** (v5.7 or higher) - [Download](https://dev.mysql.com/downloads/mysql/)
3. **Git** (optional) - [Download](https://git-scm.com/)

## Step 1: Database Setup

### 1.1 Install MySQL

If you haven't installed MySQL yet:
- Download MySQL Community Server from https://dev.mysql.com/downloads/mysql/
- Install and remember your root password

### 1.2 Create Database

Open MySQL Command Line or MySQL Workbench and run:

```sql
CREATE DATABASE agrilink_ethiopia;
USE agrilink_ethiopia;
```

### 1.3 Import Schema

Navigate to your project directory and import the schema:

```bash
cd c:\Users\HP\OneDrive\Desktop\Agrilink
mysql -u root -p agrilink_ethiopia < database\schema.sql
```

Or in MySQL Workbench:
- File → Run SQL Script
- Select `database/schema.sql`
- Execute

### 1.4 Verify Database

Check if tables were created:

```sql
SHOW TABLES;
```

You should see: `users`, `products`, `orders`, `delivery_assignments`, `offers`, `wishlists`, `system_settings`, `notifications`

## Step 2: Backend Configuration

### 2.1 Configure Environment

The `.env` file already exists but is gitignored for security. Update it with your database credentials:

**File:** `.env`
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=YOUR_MYSQL_PASSWORD_HERE
DB_NAME=agrilink_ethiopia
DB_PORT=3306

PORT=3000
NODE_ENV=development

JWT_SECRET=agrilink-secret-2024-change-in-production
JWT_EXPIRES_IN=7d

SERVICE_FEE_PERCENTAGE=10.00
```

> **Important:** Replace `YOUR_MYSQL_PASSWORD_HERE` with your actual MySQL root password

### 2.2 Install Dependencies

Open terminal in the project directory:

```bash
cd c:\Users\HP\OneDrive\Desktop\Agrilink
npm install
```

This will install all required packages:
- express
- mysql2
- bcryptjs
- jsonwebtoken
- cors
- dotenv
- and more...

## Step 3: Create Admin Account

You need to create an admin account to manage the system. Open MySQL and run:

```sql
USE agrilink_ethiopia;

-- Insert admin user (password: admin123)
INSERT INTO users (name, email, password, phone, location, type, approved, created_at)
VALUES (
    'Admin',
    'admin@agrilink.et',
    '$2a$10$YBz8qQZ3xKj7pT/0Vh8f3eK5OZf5mMQJ.wXGvH8nF7z0yT6C8KOQK',
    '+251911000000',
    'addis-ababa',
    'admin',
    1,
    NOW()
);
```

**Admin Login Credentials:**
- Email: `admin@agrilink.et`
- Password: `admin123`

> **Security Note:** Change this password in production!

## Step 4: Start the Server

### 4.1 Start Backend Server

In terminal:

```bash
npm start
```

Or for development with auto-restart:

```bash
npm run dev
```

You should see:

```
═══════════════════════════════════════════════
  🌾 Agrilink Ethiopia API Server
═══════════════════════════════════════════════
  🚀 Server running on: http://localhost:3000
  📊 Environment: development
  🗄️  Database: Connected
═══════════════════════════════════════════════
```

### 4.2 Test API

Open browser and visit: http://localhost:3000/api

You should see API information.

### 4.3 Open Frontend

In a new terminal, serve the frontend:

```bash
npx live-server --port=5500 --open=/index.html
```

Or simply open `index.html` in your browser.

## Step 5: Test the System

### 5.1 Register Users

1. **Register as Buyer:**
   - Click "Sign Up"
   - Select "Buyer/Customer"
   - Fill in details
   - Submit → You can login immediately

2. **Register as Farmer:**
   - Click "Sign Up"
   - Select "Farmer"
   - Fill in details including farm info
   - Submit → Account pending approval

3. **Register as Delivery Personnel:**
   - Click "Sign Up"
   - Select "Delivery Personnel"
   - Fill in details
   - Submit → You can login immediately

### 5.2 Approve Farmer (as Admin)

1. Login with admin credentials
2. Go to Farmers section
3. Click "Approve" on pending farmers

### 5.3 Test Product Creation (as Farmer)

1. Login as approved farmer
2. Go to "Add Product"
3. Enter product details
4. Notice the **service fee** is automatically calculated!
5. Your price: 100 ETB → Display price: 110 ETB (with 10% fee)

### 5.4 Test Order with Auto-Delivery

1. Login as buyer
2. Browse products
3. Click "Make Offer" on a product
4. Notice: **Price is FIXED**, you can only enter quantity!
5. Submit order
6. System automatically assigns delivery person if available

### 5.5 Check Delivery Dashboard

1. Login as delivery personnel
2. View assigned deliveries
3. Update status: Picked Up → In Transit → Delivered

## Features Implemented

### ✅ 1. MySQL Database
- All data persists in database
- No more localStorage limitations
- Admin can access all data
- Real-time updates

### ✅ 2. Delivery System
- Delivery personnel role added
- Automatic order assignment to nearest available delivery
- Delivery dashboard with assignment tracking
- Status updates: assigned → picked up → in transit → delivered

### ✅ 3. Fixed Pricing for Buyers
- Buyers can NO LONGER change price
- Offer form shows QUANTITY ONLY
- Price is locked to product's display price (with service fee)

### ✅ 4. Automatic Service Fee
- System automatically adds 10% service fee to all products
- Farmers see: Base price + Service fee = Display price
- Fee percentage configurable by admin
- Transparent pricing for buyers

### ✅ 5. Data Persistence & Automation
- All data stored in MySQL
- Admin dashboard shows real-time statistics
- Automated farmer approval workflow
- Automated delivery assignment
- No manual data entry needed

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/profile` - Get current user profile
- `PUT /api/auth/profile` - Update profile

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product details
- `POST /api/products` - Create product (farmer only)
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Orders
- `POST /api/orders` - Create order (auto-assigns delivery)
- `GET /api/orders/my-orders` - Get buyer's orders
- `GET /api/orders/farmer/orders` - Get farmer's orders
- `PATCH /api/orders/:id/status` - Update order status

### Delivery
- `GET /api/delivery/my-deliveries` - Get assigned deliveries
- `PATCH /api/delivery/availability` - Update availability status
- `PATCH /api/delivery/delivery/:orderId/status` - Update delivery status
- `GET /api/delivery/stats` - Get delivery statistics

### Admin
- `GET /api/admin/users` - Get all users
- `GET /api/admin/products` - Get all products
- `PATCH /api/admin/users/:id/approve` - Approve farmer
- `PATCH /api/admin/products/:id/approve` - Approve product
- `GET /api/admin/stats` - Get dashboard statistics

## Troubleshooting

### Database Connection Error

**Error:** `Database connection failed: Access denied`

**Solution:**
1. Check `.env` file has correct MySQL password
2. Verify MySQL server is running
3. Test connection: `mysql -u root -p`

### Port Already in Use

**Error:** `Port 3000 is already in use`

**Solution:**
1. Change PORT in `.env` to different number (e.g., 3001)
2. Or stop other service using port 3000

### npm Install Errors

**Error:** `npm install fails`

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### Service Fee Not Showing

**Solution:**
1. Check database: `SELECT * FROM system_settings WHERE setting_key = 'service_fee_percentage';`
2. Should show value: 10.00
3. If not, insert: `INSERT INTO system_settings (setting_key, setting_value) VALUES ('service_fee_percentage', '10.00');`

## Next Steps

1. **Customize Service Fee:**
   - Login as admin
   - Go to Settings
   - Change service fee percentage

2. **Add More Products:**
   - Login as farmer
   - Add products with images
   - Admin approves them

3. **Test Full Workflow:**
   - Buyer creates order
   - System assigns delivery
   - Delivery person updates status
   - Farmer sees order
   - Everyone gets paid!

## Production Deployment

For production:

1. Change JWT_SECRET in `.env`
2. Set NODE_ENV=production
3. Use production MySQL database
4. Enable HTTPS
5. Set up proper CORS origins
6. Regular database backups

## Support

If you encounter issues:

1. Check database is running: `mysql -u root -p`
2. Check server logs in terminal
3. Check browser console for frontend errors
4. Verify all npm packages installed: `npm list`

---

**Congratulations!** 🎉 Your Agrilink Ethiopia system is now fully operational with:
- ✅ MySQL database
- ✅ Delivery system with auto-assignment
- ✅ Fixed buyer pricing
- ✅ Automatic service fees
- ✅ Full data persistence and automation
