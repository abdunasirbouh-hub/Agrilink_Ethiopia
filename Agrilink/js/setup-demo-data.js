// Setup demo users and data for AgrilinkEthiopia
function setupDemoData() {
    // Demo users
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
    
    // Check if demo users exist, if not create them
    const existingUsers = JSON.parse(localStorage.getItem('agrilinkUsers') || '[]');
    if (existingUsers.length === 0) {
        localStorage.setItem('agrilinkUsers', JSON.stringify(demoUsers));
        console.log('Demo users created successfully');
    }
    
    // Comprehensive Product Database
    const demoProducts = generateAllProducts();
    
    // FORCE UPDATE: Clear existing data to ensure new demo data is loaded
    localStorage.removeItem('agrilinkProducts');
    
    // Check if demo products exist
    const existingProducts = JSON.parse(localStorage.getItem('agrilinkProducts') || '[]');
    if (existingProducts.length === 0) {
        localStorage.setItem('agrilinkProducts', JSON.stringify(demoProducts));
        console.log('Demo products created successfully');
    }
}

// Initialize demo data when page loads
document.addEventListener('DOMContentLoaded', function() {
    setupDemoData();
});