# 🌾 How to Initialize Demo Data for AgrilinkEthiopia

## Problem
When you host the app on a new environment (cloud), there's no localStorage data, so you can't login.

## Solution: Step-by-Step Instructions

### Method 1: Using the Initialization Page (Easiest) ⭐

1. **Upload all files** to your hosting provider (Netlify, Vercel, GitHub Pages, etc.)

2. **Open your website** in a browser (e.g., `https://your-site.com`)

3. **Navigate to the initialization page:**
   ```
   https://your-site.com/initialize.html
   ```
   Or if you're on a subdirectory:
   ```
   https://your-site.com/your-folder/initialize.html
   ```

4. **Click the "Initialize Demo Data" button**

5. **Wait for confirmation** - You'll see:
   - ✅ Demo users created successfully!
   - ✅ Demo products created successfully!

6. **Note the credentials** shown on the page:
   - **Admin**: admin@agrilinkethiopia.et / admin123
   - **Farmer 1**: abebe@example.com / password123
   - **Farmer 2**: tigist@example.com / password123
   - **Buyer**: buyer@example.com / password123

7. **Go back to home page** and click "Login"

8. **Use admin credentials** to login:
   - Email: `admin@agrilinkethiopia.et`
   - Password: `admin123`

9. **You should now be logged in!** 🎉

---

### Method 2: Using Browser Console (Advanced)

If the initialization page doesn't work, you can manually create data:

1. **Open your website** in a browser

2. **Open Developer Console:**
   - Press `F12` (Windows/Linux)
   - Press `Cmd + Option + I` (Mac)
   - Or right-click → "Inspect" → "Console" tab

3. **Paste this code** and press Enter:

```javascript
// Create demo users
const demoUsers = [
    {
        id: 'admin1',
        type: 'admin',
        name: 'Admin User',
        email: 'admin@agrilinkethiopia.et',
        phone: '+251911000000',
        location: 'addis-ababa',
        password: 'admin123',
        approved: true,
        createdAt: new Date().toISOString()
    },
    {
        id: 'farmer1',
        type: 'farmer',
        name: 'Abebe Kebede',
        email: 'abebe@example.com',
        phone: '+251911234567',
        location: 'addis-ababa',
        password: 'password123',
        approved: true,
        createdAt: new Date().toISOString()
    },
    {
        id: 'farmer2',
        type: 'farmer',
        name: 'Tigist Haile',
        email: 'tigist@example.com',
        phone: '+251922345678',
        location: 'mekelle',
        password: 'password123',
        approved: true,
        createdAt: new Date().toISOString()
    },
    {
        id: 'buyer1',
        type: 'buyer',
        name: 'Restaurant Owner',
        email: 'buyer@example.com',
        phone: '+251912345678',
        location: 'addis-ababa',
        password: 'password123',
        approved: true,
        createdAt: new Date().toISOString()
    }
];

// Save users
localStorage.setItem('agrilinkUsers', JSON.stringify(demoUsers));
console.log('✅ Demo users created!');

// For products, you need to load products-data.js first, then:
// const demoProducts = generateAllProducts();
// localStorage.setItem('agrilinkProducts', JSON.stringify(demoProducts));
// console.log('✅ Demo products created!');
```

4. **Refresh the page** and try logging in with:
   - Email: `admin@agrilinkethiopia.et`
   - Password: `admin123`

---

### Method 3: Automatic Initialization (Recommended for Production)

The app should automatically initialize data when you first visit `index.html`. Make sure:

1. ✅ `js/products-data.js` is loaded
2. ✅ `js/setup-demo-data.js` is loaded
3. ✅ `js/script.js` is loaded

**Check your `index.html`** - it should have these scripts at the bottom:
```html
<script src="js/products-data.js"></script>
<script src="js/setup-demo-data.js"></script>
<script src="js/script.js"></script>
```

---

## Demo Account Credentials

| Role | Email | Password |
|------|-------|----------|
| **Admin** | admin@agrilinkethiopia.et | admin123 |
| **Farmer 1** | abebe@example.com | password123 |
| **Farmer 2** | tigist@example.com | password123 |
| **Buyer** | buyer@example.com | password123 |

---

## Troubleshooting

### ❌ "Cannot login" after initialization

**Solution:**
1. Open browser console (F12)
2. Type: `localStorage.getItem('agrilinkUsers')`
3. If it returns `null`, data wasn't created - try Method 2
4. If it returns data, check the email/password match exactly

### ❌ "No products showing"

**Solution:**
1. Make sure `js/products-data.js` is loaded
2. Open console and type: `localStorage.getItem('agrilinkProducts')`
3. If null, visit `initialize.html` again or use Method 2

### ❌ "Page redirects immediately"

**Solution:**
- This means you're already logged in
- Clear localStorage: `localStorage.clear()` in console
- Refresh the page

### ❌ "Script errors in console"

**Solution:**
1. Check that all JavaScript files are uploaded
2. Check file paths are correct (case-sensitive on Linux servers)
3. Make sure `products-data.js` loads before `setup-demo-data.js`

---

## Important Notes

⚠️ **Data is stored in browser localStorage:**
- Each user's browser has separate data
- Data is cleared if user clears browser cache
- Data doesn't sync across devices
- This is a **demo** - not for production use!

🔒 **For Production:**
- Replace localStorage with a real database
- Use server-side authentication
- Hash passwords properly
- Implement proper session management

---

## Quick Checklist

- [ ] All files uploaded to hosting
- [ ] Visited `initialize.html` page
- [ ] Clicked "Initialize Demo Data" button
- [ ] Saw success message
- [ ] Went to home page
- [ ] Clicked "Login"
- [ ] Entered admin credentials
- [ ] Successfully logged in! ✅

---

**Need Help?** Check the browser console (F12) for any error messages.

