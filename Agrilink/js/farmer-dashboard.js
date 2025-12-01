// AgrilinkEthiopia - Farmer Dashboard JavaScript

let currentUser = null;
let myProducts = [];
let myOrders = [];
let uploadedImages = [];

// Initialize the farmer dashboard
document.addEventListener('DOMContentLoaded', function() {
    initializeFarmerDashboard();
});

function initializeFarmerDashboard() {
    // Check if user is logged in and is a farmer
    const savedUser = localStorage.getItem('agrilinkUser');
    if (!savedUser) {
        window.location.href = 'index.html';
        return;
    }
    
    currentUser = JSON.parse(savedUser);
    if (currentUser.type !== 'farmer') {
        window.location.href = 'index.html';
        return;
    }
    
    // Update UI with farmer info
    document.getElementById('farmerName').textContent = currentUser.name;
    
    // Load farmer's data
    loadFarmerData();
    
    // Show dashboard section by default
    showSection('dashboard');
    
    // Setup event listeners
    setupEventListeners();
}

function setupEventListeners() {
    // Form submission
    const addProductForm = document.getElementById('addProductForm');
    if (addProductForm) {
        addProductForm.addEventListener('submit', handleAddProduct);
    }
}

function loadFarmerData() {
    // Load farmer's products
    const allProducts = JSON.parse(localStorage.getItem('agrilinkProducts') || '[]');
    myProducts = allProducts.filter(product => product.farmer.id === currentUser.id);
    
    // Load farmer's orders (simulated)
    const allOrders = JSON.parse(localStorage.getItem('agrilinkOrders') || '[]');
    myOrders = allOrders.filter(order => order.farmerId === currentUser.id);
    
    // Update dashboard stats
    updateDashboardStats();
    
    // Load recent products and orders
    loadRecentProducts();
    loadRecentOrders();
    
    // Load products and orders tables
    loadProductsTable();
    loadOrdersTable();
}

function updateDashboardStats() {
    // Total products
    document.getElementById('totalProducts').textContent = myProducts.length;
    
    // Active listings (approved products)
    const activeListings = myProducts.filter(p => p.status === 'approved' && p.available);
    document.getElementById('activeListings').textContent = activeListings.length;
    
    // Total orders
    document.getElementById('totalOrders').textContent = myOrders.length;
    
    // Monthly revenue (simulated calculation)
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const monthlyOrders = myOrders.filter(order => {
        const orderDate = new Date(order.date);
        return orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear && order.status === 'completed';
    });
    
    const monthlyRevenue = monthlyOrders.reduce((total, order) => total + order.totalPrice, 0);
    document.getElementById('monthlyRevenue').textContent = `ETB ${monthlyRevenue.toLocaleString()}`;
}

function loadRecentProducts() {
    const recentProductsContainer = document.getElementById('recentProducts');
    if (!recentProductsContainer) return;
    
    const recentProducts = myProducts.slice(0, 5);
    
    if (recentProducts.length === 0) {
        recentProductsContainer.innerHTML = '<p style="color: #666; text-align: center; padding: 2rem;">No products listed yet. Add your first product to get started!</p>';
        return;
    }
    
    recentProductsContainer.innerHTML = `
        <table class="products-table">
            <thead>
                <tr>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${recentProducts.map(product => `
                    <tr>
                        <td>
                            <div class="product-info">
                                <img src="${product.images[0]}" alt="${product.title}" class="product-thumbnail">
                                <div>
                                    <div style="font-weight: 500;">${product.title}</div>
                                    <div style="font-size: 0.9rem; color: #666;">${product.quantity}</div>
                                </div>
                            </div>
                        </td>
                        <td>ETB ${product.price}/kg</td>
                        <td>
                            <span class="status-badge status-${product.status || 'pending'}">
                                ${product.status ? product.status.charAt(0).toUpperCase() + product.status.slice(1) : 'Pending'}
                            </span>
                        </td>
                        <td>
                            <div class="action-buttons">
                                <button class="btn btn-small btn-outline" onclick="editProduct('${product.id}')">Edit</button>
                                <button class="btn btn-small btn-outline" onclick="viewProductDetails('${product.id}')">View</button>
                            </div>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

function loadRecentOrders() {
    const recentOrdersContainer = document.getElementById('recentOrders');
    if (!recentOrdersContainer) return;
    
    const recentOrders = myOrders.slice(0, 5).sort((a, b) => new Date(b.date) - new Date(a.date));
    
    if (recentOrders.length === 0) {
        recentOrdersContainer.innerHTML = '<p style="color: #666; text-align: center; padding: 2rem;">No orders yet. Your orders will appear here when buyers contact you.</p>';
        return;
    }
    
    recentOrdersContainer.innerHTML = `
        <table class="orders-table">
            <thead>
                <tr>
                    <th>Order ID</th>
                    <th>Buyer</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${recentOrders.map(order => `
                    <tr>
                        <td>#${order.id}</td>
                        <td>${order.buyerName}</td>
                        <td>ETB ${order.totalPrice.toLocaleString()}</td>
                        <td>
                            <span class="order-status ${order.status}">
                                ${order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </span>
                        </td>
                        <td>
                            <div class="action-buttons">
                                <button class="btn btn-small btn-primary" onclick="viewOrderDetails('${order.id}')">View</button>
                                ${order.status === 'new' ? `<button class="btn btn-small btn-outline" onclick="acceptOrder('${order.id}')">Accept</button>` : ''}
                            </div>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

function loadProductsTable() {
    const productsTableBody = document.getElementById('productsTableBody');
    if (!productsTableBody) return;
    
    if (myProducts.length === 0) {
        productsTableBody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center; padding: 2rem; color: #666;">
                    No products listed yet. <a href="#" onclick="showSection('add-product')">Add your first product</a>.
                </td>
            </tr>
        `;
        return;
    }
    
    productsTableBody.innerHTML = myProducts.map(product => `
        <tr>
            <td>
                <div class="product-info">
                    <img src="${product.images[0]}" alt="${product.title}" class="product-thumbnail">
                    <div>
                        <div style="font-weight: 500;">${product.title}</div>
                        <div style="font-size: 0.9rem; color: #666;">${product.quantity}</div>
                    </div>
                </div>
            </td>
            <td>${getCategoryDisplayName(product.category)}</td>
            <td>ETB ${product.price}/kg</td>
            <td>${product.quantity}</td>
            <td>
                <span class="status-badge status-${product.status || 'pending'}">
                    ${product.status ? product.status.charAt(0).toUpperCase() + product.status.slice(1) : 'Pending'}
                </span>
            </td>
            <td>${formatDate(product.postedDate)}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-small btn-outline" onclick="editProduct('${product.id}')">Edit</button>
                    <button class="btn btn-small btn-outline" onclick="viewProductDetails('${product.id}')">View</button>
                    <button class="btn btn-small" style="background: #e74c3c; color: white;" onclick="deleteProduct('${product.id}')">Delete</button>
                </div>
            </td>
        </tr>
    `).join('');
}

function loadOrdersTable() {
    const ordersTableBody = document.getElementById('ordersTableBody');
    if (!ordersTableBody) return;
    
    if (myOrders.length === 0) {
        ordersTableBody.innerHTML = `
            <tr>
                <td colspan="8" style="text-align: center; padding: 2rem; color: #666;">
                    No orders received yet.
                </td>
            </tr>
        `;
        return;
    }
    
    ordersTableBody.innerHTML = myOrders.map(order => `
        <tr>
            <td>#${order.id}</td>
            <td>${order.productName}</td>
            <td>${order.buyerName}</td>
            <td>${order.quantity}</td>
            <td>ETB ${order.totalPrice.toLocaleString()}</td>
            <td>
                <span class="order-status ${order.status}">
                    ${order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
            </td>
            <td>${formatDate(order.date)}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-small btn-primary" onclick="viewOrderDetails('${order.id}')">View</button>
                    ${order.status === 'new' ? `<button class="btn btn-small btn-outline" onclick="acceptOrder('${order.id}')">Accept</button>` : ''}
                </div>
            </td>
        </tr>
    `).join('');
}

function showSection(sectionName) {
    // Hide all sections
    document.querySelectorAll('.dashboard-section').forEach(section => {
        section.style.display = 'none';
    });
    
    // Show selected section
    const selectedSection = document.getElementById(`${sectionName}-section`);
    if (selectedSection) {
        selectedSection.style.display = 'block';
    }
    
    // Update sidebar navigation
    document.querySelectorAll('.sidebar-nav a').forEach(link => {
        link.classList.remove('active');
    });
    
    const activeLink = document.querySelector(`.sidebar-nav a[href="#${sectionName}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
    
    // Close mobile menu if open
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
        sidebar.classList.remove('active');
    }
    
    // Load section-specific data
    switch(sectionName) {
        case 'dashboard':
            updateDashboardStats();
            loadRecentProducts();
            loadRecentOrders();
            break;
        case 'products':
            loadProductsTable();
            break;
        case 'orders':
            loadOrdersTable();
            break;
    }
}

function showMobileMenu() {
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
        sidebar.classList.toggle('active');
    }
}

// Product Management Functions
function handleAddProduct(event) {
    event.preventDefault();
    
    if (uploadedImages.length < 3) {
        showNotification('Please upload at least 3 product images.', 'error');
        return;
    }
    
    const newProduct = {
        id: Date.now().toString(),
        title: document.getElementById('productTitle').value,
        category: document.getElementById('productCategory').value,
        price: parseFloat(document.getElementById('productPrice').value),
        quantity: document.getElementById('productQuantity').value,
        location: document.getElementById('productLocation').value,
        description: document.getElementById('productDescription').value,
        harvestDate: document.getElementById('productHarvestDate').value,
        organic: document.getElementById('productOrganic').checked,
        certified: document.getElementById('productCertified').checked,
        images: uploadedImages,
        farmer: {
            id: currentUser.id,
            name: currentUser.name,
            phone: currentUser.phone,
            rating: 4.8
        },
        postedDate: new Date().toISOString().split('T')[0],
        available: true,
        status: 'pending' // Pending admin approval
    };
    
    // Save to localStorage
    const allProducts = JSON.parse(localStorage.getItem('agrilinkProducts') || '[]');
    allProducts.push(newProduct);
    localStorage.setItem('agrilinkProducts', JSON.stringify(allProducts));
    
    // Update local products array
    myProducts.push(newProduct);
    
    // Show success message
    showNotification('Product submitted successfully! It will be visible after admin approval.', 'success');
    
    // Reset form
    resetAddProductForm();
    
    // Switch to products section
    setTimeout(() => {
        showSection('products');
    }, 1500);
}

function handleImageUpload(event) {
    const files = event.target.files;
    const uploadedImagesContainer = document.getElementById('uploadedImages');
    
    for (let file of files) {
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = function(e) {
                uploadedImages.push(e.target.result);
                displayUploadedImages();
            };
            reader.readAsDataURL(file);
        }
    }
}

function displayUploadedImages() {
    const uploadedImagesContainer = document.getElementById('uploadedImages');
    if (!uploadedImagesContainer) return;
    
    uploadedImagesContainer.innerHTML = uploadedImages.map((image, index) => `
        <div class="uploaded-image">
            <img src="${image}" alt="Product image ${index + 1}">
            <button class="remove-image" onclick="removeImage(${index})">×</button>
        </div>
    `).join('');
}

function removeImage(index) {
    uploadedImages.splice(index, 1);
    displayUploadedImages();
}

function resetAddProductForm() {
    document.getElementById('addProductForm').reset();
    uploadedImages = [];
    displayUploadedImages();
}

function editProduct(productId) {
    const product = myProducts.find(p => p.id === productId);
    if (product) {
        // Populate form with product data
        document.getElementById('productTitle').value = product.title;
        document.getElementById('productCategory').value = product.category;
        document.getElementById('productPrice').value = product.price;
        document.getElementById('productQuantity').value = product.quantity;
        document.getElementById('productLocation').value = product.location;
        document.getElementById('productDescription').value = product.description;
        document.getElementById('productOrganic').checked = product.organic;
        document.getElementById('productCertified').checked = product.certified;
        
        // Load existing images
        uploadedImages = [...product.images];
        displayUploadedImages();
        
        // Switch to add product section
        showSection('add-product');
        
        showNotification('Product loaded for editing. Make your changes and submit.', 'info');
    }
}

function deleteProduct(productId) {
    if (confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
        // Remove from localStorage
        const allProducts = JSON.parse(localStorage.getItem('agrilinkProducts') || '[]');
        const updatedProducts = allProducts.filter(p => p.id !== productId);
        localStorage.setItem('agrilinkProducts', JSON.stringify(updatedProducts));
        
        // Remove from local array
        myProducts = myProducts.filter(p => p.id !== productId);
        
        // Reload products table
        loadProductsTable();
        updateDashboardStats();
        
        showNotification('Product deleted successfully.', 'success');
    }
}

function viewProductDetails(productId) {
    const product = myProducts.find(p => p.id === productId);
    if (product) {
        sessionStorage.setItem('selectedProduct', JSON.stringify(product));
        window.location.href = 'product-detail.html';
    }
}

// Order Management Functions
function viewOrderDetails(orderId) {
    const order = myOrders.find(o => o.id === orderId);
    if (order) {
        // Create order details modal
        const modalHtml = `
            <div id="orderDetailsModal" class="modal">
                <div class="modal-content">
                    <span class="close" onclick="closeModal('orderDetailsModal')">&times;</span>
                    <h2>Order Details</h2>
                    <div class="order-details">
                        <div class="detail-row">
                            <strong>Order ID:</strong> #${order.id}
                        </div>
                        <div class="detail-row">
                            <strong>Product:</strong> ${order.productName}
                        </div>
                        <div class="detail-row">
                            <strong>Buyer Name:</strong> ${order.buyerName}
                        </div>
                        <div class="detail-row">
                            <strong>Buyer Phone:</strong> ${order.buyerPhone}
                        </div>
                        <div class="detail-row">
                            <strong>Quantity:</strong> ${order.quantity}
                        </div>
                        <div class="detail-row">
                            <strong>Total Price:</strong> ETB ${order.totalPrice.toLocaleString()}
                        </div>
                        <div class="detail-row">
                            <strong>Status:</strong> ${order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </div>
                        <div class="detail-row">
                            <strong>Order Date:</strong> ${formatDate(order.date)}
                        </div>
                        <div class="detail-row">
                            <strong>Delivery Address:</strong> ${order.deliveryAddress || 'Not specified'}
                        </div>
                        <div class="detail-row">
                            <strong>Special Instructions:</strong> ${order.instructions || 'None'}
                        </div>
                    </div>
                    <div class="order-actions">
                        ${order.status === 'new' ? `
                            <button class="btn btn-primary" onclick="acceptOrder('${order.id}')">Accept Order</button>
                            <button class="btn" style="background: #e74c3c; color: white;" onclick="rejectOrder('${order.id}')">Reject Order</button>
                        ` : ''}
                        <button class="btn btn-outline" onclick="contactBuyer('${order.buyerPhone}')">Contact Buyer</button>
                    </div>
                </div>
            </div>
        `;
        
        // Remove existing modal if any
        const existingModal = document.getElementById('orderDetailsModal');
        if (existingModal) {
            existingModal.remove();
        }
        
        // Add new modal to body
        document.body.insertAdjacentHTML('beforeend', modalHtml);
        document.getElementById('orderDetailsModal').style.display = 'block';
    }
}

function acceptOrder(orderId) {
    const allOrders = JSON.parse(localStorage.getItem('agrilinkOrders') || '[]');
    const orderIndex = allOrders.findIndex(o => o.id === orderId);
    
    if (orderIndex !== -1) {
        allOrders[orderIndex].status = 'processing';
        localStorage.setItem('agrilinkOrders', JSON.stringify(allOrders));
        
        // Update local orders array
        const localOrderIndex = myOrders.findIndex(o => o.id === orderId);
        if (localOrderIndex !== -1) {
            myOrders[localOrderIndex].status = 'processing';
        }
        
        showNotification('Order accepted! The buyer will be notified.', 'success');
        loadOrdersTable();
        loadRecentOrders();
        
        // Close modal if open
        const modal = document.getElementById('orderDetailsModal');
        if (modal) {
            modal.style.display = 'none';
        }
    }
}

function rejectOrder(orderId) {
    if (confirm('Are you sure you want to reject this order?')) {
        const allOrders = JSON.parse(localStorage.getItem('agrilinkOrders') || '[]');
        const orderIndex = allOrders.findIndex(o => o.id === orderId);
        
        if (orderIndex !== -1) {
            allOrders[orderIndex].status = 'cancelled';
            localStorage.setItem('agrilinkOrders', JSON.stringify(allOrders));
            
            // Update local orders array
            const localOrderIndex = myOrders.findIndex(o => o.id === orderId);
            if (localOrderIndex !== -1) {
                myOrders[localOrderIndex].status = 'cancelled';
            }
            
            showNotification('Order rejected.', 'info');
            loadOrdersTable();
            loadRecentOrders();
            
            // Close modal if open
            const modal = document.getElementById('orderDetailsModal');
            if (modal) {
                modal.style.display = 'none';
            }
        }
    }
}

function contactBuyer(phoneNumber) {
    window.location.href = `tel:${phoneNumber}`;
}

// Filter Functions
function filterProducts() {
    const statusFilter = document.getElementById('productStatusFilter').value;
    const categoryFilter = document.getElementById('productCategoryFilter').value;
    
    let filteredProducts = [...myProducts];
    
    if (statusFilter) {
        filteredProducts = filteredProducts.filter(p => 
            (p.status || 'pending') === statusFilter
        );
    }
    
    if (categoryFilter) {
        filteredProducts = filteredProducts.filter(p => p.category === categoryFilter);
    }
    
    // Update table with filtered products
    const productsTableBody = document.getElementById('productsTableBody');
    if (filteredProducts.length === 0) {
        productsTableBody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center; padding: 2rem; color: #666;">
                    No products found matching your filters.
                </td>
            </tr>
        `;
        return;
    }
    
    productsTableBody.innerHTML = filteredProducts.map(product => `
        <tr>
            <td>
                <div class="product-info">
                    <img src="${product.images[0]}" alt="${product.title}" class="product-thumbnail">
                    <div>
                        <div style="font-weight: 500;">${product.title}</div>
                        <div style="font-size: 0.9rem; color: #666;">${product.quantity}</div>
                    </div>
                </div>
            </td>
            <td>${getCategoryDisplayName(product.category)}</td>
            <td>ETB ${product.price}/kg</td>
            <td>${product.quantity}</td>
            <td>
                <span class="status-badge status-${product.status || 'pending'}">
                    ${product.status ? product.status.charAt(0).toUpperCase() + product.status.slice(1) : 'Pending'}
                </span>
            </td>
            <td>${formatDate(product.postedDate)}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-small btn-outline" onclick="editProduct('${product.id}')">Edit</button>
                    <button class="btn btn-small btn-outline" onclick="viewProductDetails('${product.id}')">View</button>
                    <button class="btn btn-small" style="background: #e74c3c; color: white;" onclick="deleteProduct('${product.id}')">Delete</button>
                </div>
            </td>
        </tr>
    `).join('');
}

function filterOrders() {
    const statusFilter = document.getElementById('orderStatusFilter').value;
    
    let filteredOrders = [...myOrders];
    
    if (statusFilter) {
        filteredOrders = filteredOrders.filter(o => o.status === statusFilter);
    }
    
    // Update table with filtered orders
    const ordersTableBody = document.getElementById('ordersTableBody');
    if (filteredOrders.length === 0) {
        ordersTableBody.innerHTML = `
            <tr>
                <td colspan="8" style="text-align: center; padding: 2rem; color: #666;">
                    No orders found matching your filters.
                </td>
            </tr>
        `;
        return;
    }
    
    ordersTableBody.innerHTML = filteredOrders.map(order => `
        <tr>
            <td>#${order.id}</td>
            <td>${order.productName}</td>
            <td>${order.buyerName}</td>
            <td>${order.quantity}</td>
            <td>ETB ${order.totalPrice.toLocaleString()}</td>
            <td>
                <span class="order-status ${order.status}">
                    ${order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
            </td>
            <td>${formatDate(order.date)}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-small btn-primary" onclick="viewOrderDetails('${order.id}')">View</button>
                    ${order.status === 'new' ? `<button class="btn btn-small btn-outline" onclick="acceptOrder('${order.id}')">Accept</button>` : ''}
                </div>
            </td>
        </tr>
    `).join('');
}

// Utility Functions
function getCategoryDisplayName(category) {
    const categoryNames = {
        'vegetables': 'Vegetables',
        'fruits': 'Fruits',
        'grains': 'Grains',
        'spices': 'Spices',
        'legumes': 'Legumes',
        'dairy': 'Dairy Products'
    };
    return categoryNames[category] || category;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `${type}-message notification`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 9999;
        padding: 16px 24px;
        border-radius: 8px;
        max-width: 400px;
        animation: slideInRight 0.3s ease;
    `;
    
    // Add to body
    document.body.appendChild(notification);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('agrilinkUser');
        window.location.href = 'index.html';
    }
}

// Profile Management Functions
function loadProfile() {
    if (currentUser) {
        document.getElementById('profileName').value = currentUser.name || '';
        document.getElementById('profileEmail').value = currentUser.email || '';
        document.getElementById('profilePhone').value = currentUser.phone || '';
        document.getElementById('profileLocation').value = currentUser.location || '';
        document.getElementById('profileFarmSize').value = currentUser.farmSize || '';
        document.getElementById('profileExperience').value = currentUser.experience || '';
        document.getElementById('profileBio').value = currentUser.bio || '';
    }
}

function updateProfile(event) {
    event.preventDefault();
    
    // Get form values
    const updatedProfile = {
        name: document.getElementById('profileName').value,
        email: document.getElementById('profileEmail').value,
        phone: document.getElementById('profilePhone').value,
        location: document.getElementById('profileLocation').value,
        farmSize: document.getElementById('profileFarmSize').value,
        experience: document.getElementById('profileExperience').value,
        bio: document.getElementById('profileBio').value
    };
    
    // Update current user object
    Object.assign(currentUser, updatedProfile);
    
    // Update in localStorage
    localStorage.setItem('agrilinkUser', JSON.stringify(currentUser));
    
    // Update in users array
    const users = JSON.parse(localStorage.getItem('agrilinkUsers') || '[]');
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    if (userIndex !== -1) {
        Object.assign(users[userIndex], updatedProfile);
        localStorage.setItem('agrilinkUsers', JSON.stringify(users));
    }
    
    showNotification('Profile updated successfully!', 'success');
}

// Load profile when profile section is shown
document.addEventListener('DOMContentLoaded', function() {
    const profileSection = document.getElementById('profile-section');
    if (profileSection) {
        // Create a MutationObserver to detect when profile section becomes visible
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.attributeName === 'style') {
                    const isVisible = profileSection.style.display !== 'none';
                    if (isVisible) {
                        loadProfile();
                    }
                }
            });
        });
        observer.observe(profileSection, { attributes: true });
    }
});



// Add CSS for order details
const orderDetailsCSS = `
    .order-details {
        background: #f8f9fa;
        padding: 1.5rem;
        border-radius: 8px;
        margin-bottom: 1.5rem;
    }
    
    .detail-row {
        display: flex;
        justify-content: space-between;
        padding: 0.5rem 0;
        border-bottom: 1px solid #e1e8ed;
    }
    
    .detail-row:last-child {
        border-bottom: none;
    }
    
    .order-actions {
        display: flex;
        gap: 1rem;
        justify-content: center;
    }
`;

const style = document.createElement('style');
style.textContent = orderDetailsCSS;
document.head.appendChild(style);