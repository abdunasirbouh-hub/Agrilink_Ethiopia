// AgrilinkEthiopia - Admin Dashboard JavaScript

let currentUser = null;
let allUsers = [];
let allProducts = [];
let allOrders = [];
let filteredData = {
    farmers: [],
    buyers: [],
    products: [],
    orders: []
};

// Initialize the admin dashboard
document.addEventListener('DOMContentLoaded', function() {
    initializeAdminDashboard();
});

function initializeAdminDashboard() {
    // Check if user is logged in and is an admin
    const savedUser = localStorage.getItem('agrilinkUser');
    if (!savedUser) {
        window.location.href = 'index.html';
        return;
    }
    
    currentUser = JSON.parse(savedUser);
    if (currentUser.type !== 'admin') {
        window.location.href = 'index.html';
        return;
    }
    
    // Load all platform data
    loadPlatformData();
    
    // Show dashboard section by default
    showSection('dashboard');
    
    // Setup event listeners
    setupEventListeners();
}

function setupEventListeners() {
    // Search functionality with debounce
    const searchInputs = [
        { id: 'farmerSearch', handler: searchFarmers },
        { id: 'buyerSearch', handler: searchBuyers },
        { id: 'productSearch', handler: searchProducts },
        { id: 'orderSearch', handler: searchOrders }
    ];
    
    searchInputs.forEach(input => {
        const element = document.getElementById(input.id);
        if (element) {
            element.addEventListener('keyup', debounce(input.handler, 300));
        }
    });
}

function loadPlatformData() {
    // Load all users
    allUsers = JSON.parse(localStorage.getItem('agrilinkUsers') || '[]');
    
    // Load all products
    allProducts = JSON.parse(localStorage.getItem('agrilinkProducts') || '[]');
    
    // Load all orders
    allOrders = JSON.parse(localStorage.getItem('agrilinkOrders') || '[]');
    
    // Initialize filtered data
    filteredData.farmers = allUsers.filter(user => user.type === 'farmer');
    filteredData.buyers = allUsers.filter(user => user.type === 'buyer');
    filteredData.products = [...allProducts];
    filteredData.orders = [...allOrders];
    
    // Update dashboard stats
    updateDashboardStats();
    
    // Load data into tables
    loadFarmersTable();
    loadBuyersTable();
    loadProductsTable();
    loadOrdersTable();
    
    // Load recent activity
    loadRecentActivity();
    
    // Update pending alerts
    updatePendingAlerts();
}

function updateDashboardStats() {
    // Total users
    document.getElementById('totalUsers').textContent = allUsers.length;
    
    // Active farmers
    const activeFarmers = allUsers.filter(user => user.type === 'farmer' && user.approved);
    document.getElementById('activeFarmers').textContent = activeFarmers.length;
    
    // Pending approvals
    const pendingFarmers = allUsers.filter(user => user.type === 'farmer' && !user.approved);
    const pendingProducts = allProducts.filter(product => !product.status || product.status === 'pending');
    document.getElementById('pendingApprovals').textContent = pendingFarmers.length + pendingProducts.length;
    
    // Total products
    document.getElementById('totalProducts').textContent = allProducts.length;
    
    // Update quick action counts
    document.getElementById('pendingFarmersCount').textContent = `${pendingFarmers.length} pending`;
    document.getElementById('pendingProductsCount').textContent = `${pendingProducts.length} pending`;
    
    const activeOrders = allOrders.filter(order => order.status === 'new' || order.status === 'processing');
    document.getElementById('activeOrdersCount').textContent = `${activeOrders.length} active`;
}

function updatePendingAlerts() {
    const pendingFarmers = allUsers.filter(user => user.type === 'farmer' && !user.approved);
    const pendingAlert = document.getElementById('pendingAlert');
    const pendingCount = document.getElementById('pendingCount');
    
    if (pendingFarmers.length > 0) {
        pendingAlert.style.display = 'block';
        pendingCount.textContent = pendingFarmers.length;
    } else {
        pendingAlert.style.display = 'none';
    }
}

function loadRecentActivity() {
    const recentActivityContainer = document.getElementById('recentActivity');
    if (!recentActivityContainer) return;
    
    // Create recent activity data
    const activities = [];
    
    // Recent farmer registrations
    const recentFarmers = allUsers
        .filter(user => user.type === 'farmer')
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 3);
    
    recentFarmers.forEach(farmer => {
        activities.push({
            type: 'farmer',
            icon: '👨‍🌾',
            title: `New farmer registration: ${farmer.name}`,
            subtitle: `Location: ${getLocationDisplayName(farmer.location)}`,
            date: farmer.createdAt,
            status: farmer.approved ? 'approved' : 'pending'
        });
    });
    
    // Recent product postings
    const recentProducts = allProducts
        .sort((a, b) => new Date(b.postedDate) - new Date(a.postedDate))
        .slice(0, 3);
    
    recentProducts.forEach(product => {
        activities.push({
            type: 'product',
            icon: '🌾',
            title: `New product posted: ${product.title}`,
            subtitle: `By: ${product.farmer.name}`,
            date: product.postedDate,
            status: product.status || 'pending'
        });
    });
    
    // Recent orders
    const recentOrders = allOrders
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 3);
    
    recentOrders.forEach(order => {
        activities.push({
            type: 'order',
            icon: '📦',
            title: `New order: ${order.productName}`,
            subtitle: `Buyer: ${order.buyerName}`,
            date: order.date,
            status: order.status
        });
    });
    
    // Sort activities by date
    activities.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Display recent activities
    if (activities.length === 0) {
        recentActivityContainer.innerHTML = '<p style="color: #666; text-align: center; padding: 2rem;">No recent activity.</p>';
        return;
    }
    
    recentActivityContainer.innerHTML = `
        <table class="data-table">
            <thead>
                <tr>
                    <th>Activity</th>
                    <th>Date</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                ${activities.slice(0, 5).map(activity => `
                    <tr>
                        <td>
                            <div style="display: flex; align-items: center; gap: 0.5rem;">
                                <span style="font-size: 1.2rem;">${activity.icon}</span>
                                <div>
                                    <div style="font-weight: 500;">${activity.title}</div>
                                    <div style="font-size: 0.9rem; color: #666;">${activity.subtitle}</div>
                                </div>
                            </div>
                        </td>
                        <td>${formatDate(activity.date)}</td>
                        <td>
                            <span class="status-badge status-${activity.status}">
                                ${activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
                            </span>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

function loadFarmersTable() {
    const farmersTableBody = document.getElementById('farmersTableBody');
    if (!farmersTableBody) return;
    
    if (filteredData.farmers.length === 0) {
        farmersTableBody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center; padding: 2rem; color: #666;">
                    No farmers found.
                </td>
            </tr>
        `;
        return;
    }
    
    farmersTableBody.innerHTML = filteredData.farmers.map(farmer => {
        const farmerProducts = allProducts.filter(product => product.farmer.id === farmer.id);
        return `
            <tr>
                <td>
                    <div class="user-info">
                        <div class="user-avatar">${farmer.name.charAt(0)}</div>
                        <div class="user-details">
                            <div class="user-name">${farmer.name}</div>
                            <div class="user-email">${farmer.email}</div>
                        </div>
                    </div>
                </td>
                <td>
                    <div>📱 ${farmer.phone}</div>
                </td>
                <td>${getLocationDisplayName(farmer.location)}</td>
                <td>${farmerProducts.length} products</td>
                <td>${formatDate(farmer.createdAt)}</td>
                <td>
                    <span class="status-badge status-${farmer.approved ? 'approved' : 'pending'}">
                        ${farmer.approved ? 'Approved' : 'Pending'}
                    </span>
                </td>
                <td>
                    <div class="action-buttons">
                        ${!farmer.approved ? `
                            <button class="btn-small btn-approve" onclick="approveFarmer('${farmer.id}')">Approve</button>
                            <button class="btn-small btn-reject" onclick="rejectFarmer('${farmer.id}')">Reject</button>
                        ` : `
                            <button class="btn-small btn-suspend" onclick="suspendFarmer('${farmer.id}')">Suspend</button>
                        `}
                        <button class="btn-small btn-view" onclick="viewUserDetails('${farmer.id}')">View</button>
                        <button class="btn-small btn-delete" onclick="deleteUser('${farmer.id}')">Delete</button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

function loadBuyersTable() {
    const buyersTableBody = document.getElementById('buyersTableBody');
    if (!buyersTableBody) return;
    
    if (filteredData.buyers.length === 0) {
        buyersTableBody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center; padding: 2rem; color: #666;">
                    No buyers found.
                </td>
            </tr>
        `;
        return;
    }
    
    buyersTableBody.innerHTML = filteredData.buyers.map(buyer => {
        const buyerOrders = allOrders.filter(order => order.buyerId === buyer.id);
        return `
            <tr>
                <td>
                    <div class="user-info">
                        <div class="user-avatar">${buyer.name.charAt(0)}</div>
                        <div class="user-details">
                            <div class="user-name">${buyer.name}</div>
                            <div class="user-email">${buyer.email}</div>
                        </div>
                    </div>
                </td>
                <td>
                    <div>📱 ${buyer.phone}</div>
                </td>
                <td>${getLocationDisplayName(buyer.location)}</td>
                <td>${buyerOrders.length} orders</td>
                <td>${formatDate(buyer.createdAt)}</td>
                <td>
                    <span class="status-badge status-approved">
                        Active
                    </span>
                </td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-small btn-suspend" onclick="suspendBuyer('${buyer.id}')">Suspend</button>
                        <button class="btn-small btn-view" onclick="viewUserDetails('${buyer.id}')">View</button>
                        <button class="btn-small btn-delete" onclick="deleteUser('${buyer.id}')">Delete</button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

function loadProductsTable() {
    const productsTableBody = document.getElementById('productsTableBody');
    if (!productsTableBody) return;
    
    if (filteredData.products.length === 0) {
        productsTableBody.innerHTML = `
            <tr>
                <td colspan="8" style="text-align: center; padding: 2rem; color: #666;">
                    No products found.
                </td>
            </tr>
        `;
        return;
    }
    
    productsTableBody.innerHTML = filteredData.products.map(product => `
        <tr>
            <td>
                <div class="product-info">
                    <img src="${product.images[0]}" alt="${product.title}" style="width: 40px; height: 40px; border-radius: 8px; object-fit: cover;">
                    <div>
                        <div style="font-weight: 500;">${product.title}</div>
                        <div style="font-size: 0.9rem; color: #666;">${product.quantity}</div>
                    </div>
                </div>
            </td>
            <td>${product.farmer.name}</td>
            <td>${getCategoryDisplayName(product.category)}</td>
            <td>ETB ${product.price}/kg</td>
            <td>${product.quantity}</td>
            <td>${formatDate(product.postedDate)}</td>
            <td>
                <span class="status-badge status-${product.status || 'pending'}">
                    ${product.status ? product.status.charAt(0).toUpperCase() + product.status.slice(1) : 'Pending'}
                </span>
            </td>
            <td>
                <div class="action-buttons">
                    ${!product.status || product.status === 'pending' ? `
                        <button class="btn-small btn-approve" onclick="approveProduct('${product.id}')">Approve</button>
                        <button class="btn-small btn-reject" onclick="rejectProduct('${product.id}')">Reject</button>
                    ` : `
                        <button class="btn-small btn-suspend" onclick="suspendProduct('${product.id}')">Suspend</button>
                    `}
                    <button class="btn-small btn-view" onclick="viewProductDetails('${product.id}')">View</button>
                    <button class="btn-small btn-delete" onclick="deleteProduct('${product.id}')">Delete</button>
                </div>
            </td>
        </tr>
    `).join('');
}

function loadOrdersTable() {
    const ordersTableBody = document.getElementById('ordersTableBody');
    if (!ordersTableBody) return;
    
    if (filteredData.orders.length === 0) {
        ordersTableBody.innerHTML = `
            <tr>
                <td colspan="8" style="text-align: center; padding: 2rem; color: #666;">
                    No orders found.
                </td>
            </tr>
        `;
        return;
    }
    
    ordersTableBody.innerHTML = filteredData.orders.map(order => `
        <tr>
            <td>#${order.id}</td>
            <td>${order.productName}</td>
            <td>${order.buyerName}</td>
            <td>${order.farmerName || 'Unknown'}</td>
            <td>ETB ${order.totalPrice.toLocaleString()}</td>
            <td>${formatDate(order.date)}</td>
            <td>
                <span class="order-status ${order.status}">
                    ${order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
            </td>
            <td>
                <div class="action-buttons">
                    <button class="btn-small btn-view" onclick="viewOrderDetails('${order.id}')">View</button>
                    ${order.status === 'completed' ? `<button class="btn-small btn-approve" onclick="refundOrder('${order.id}')">Refund</button>` : ''}
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
            loadRecentActivity();
            updatePendingAlerts();
            break;
        case 'farmers':
            loadFarmersTable();
            break;
        case 'buyers':
            loadBuyersTable();
            break;
        case 'products':
            loadProductsTable();
            break;
        case 'orders':
            loadOrdersTable();
            break;
        case 'settings':
            loadSettingsContent();
            break;
    }
}

function showMobileMenu() {
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
        sidebar.classList.toggle('active');
    }
}

// User Management Functions
function approveFarmer(farmerId) {
    if (confirm('Are you sure you want to approve this farmer?')) {
        const userIndex = allUsers.findIndex(user => user.id === farmerId);
        if (userIndex !== -1) {
            allUsers[userIndex].approved = true;
            allUsers[userIndex].approvedAt = new Date().toISOString();
            localStorage.setItem('agrilinkUsers', JSON.stringify(allUsers));
            
            showNotification('Farmer approved successfully!', 'success');
            loadPlatformData();
            loadFarmersTable();
        }
    }
}

function rejectFarmer(farmerId) {
    if (confirm('Are you sure you want to reject this farmer? This action cannot be undone.')) {
        const userIndex = allUsers.findIndex(user => user.id === farmerId);
        if (userIndex !== -1) {
            allUsers[userIndex].approved = false;
            allUsers[userIndex].rejectedAt = new Date().toISOString();
            localStorage.setItem('agrilinkUsers', JSON.stringify(allUsers));
            
            showNotification('Farmer rejected.', 'info');
            loadPlatformData();
            loadFarmersTable();
        }
    }
}

function suspendFarmer(farmerId) {
    if (confirm('Are you sure you want to suspend this farmer?')) {
        const userIndex = allUsers.findIndex(user => user.id === farmerId);
        if (userIndex !== -1) {
            allUsers[userIndex].suspended = true;
            allUsers[userIndex].suspendedAt = new Date().toISOString();
            localStorage.setItem('agrilinkUsers', JSON.stringify(allUsers));
            
            showNotification('Farmer suspended.', 'warning');
            loadPlatformData();
            loadFarmersTable();
        }
    }
}

function suspendBuyer(buyerId) {
    if (confirm('Are you sure you want to suspend this buyer?')) {
        const userIndex = allUsers.findIndex(user => user.id === buyerId);
        if (userIndex !== -1) {
            allUsers[userIndex].suspended = true;
            allUsers[userIndex].suspendedAt = new Date().toISOString();
            localStorage.setItem('agrilinkUsers', JSON.stringify(allUsers));
            
            showNotification('Buyer suspended.', 'warning');
            loadPlatformData();
            loadBuyersTable();
        }
    }
}

function deleteUser(userId) {
    if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
        // Remove user
        allUsers = allUsers.filter(user => user.id !== userId);
        
        // Remove user's products
        allProducts = allProducts.filter(product => product.farmer.id !== userId);
        
        // Remove user's orders
        allOrders = allOrders.filter(order => order.buyerId !== userId || order.farmerId !== userId);
        
        // Save to localStorage
        localStorage.setItem('agrilinkUsers', JSON.stringify(allUsers));
        localStorage.setItem('agrilinkProducts', JSON.stringify(allProducts));
        localStorage.setItem('agrilinkOrders', JSON.stringify(allOrders));
        
        showNotification('User deleted successfully.', 'success');
        loadPlatformData();
        loadFarmersTable();
        loadBuyersTable();
    }
}

function viewUserDetails(userId) {
    const user = allUsers.find(u => u.id === userId);
    if (user) {
        const userProducts = allProducts.filter(product => product.farmer.id === userId);
        const userOrders = allOrders.filter(order => order.buyerId === userId || order.farmerId === userId);
        
        const modalHtml = `
            <div id="userDetailsModal" class="modal">
                <div class="modal-content">
                    <span class="close" onclick="closeModal('userDetailsModal')">&times;</span>
                    <h2>${user.type === 'farmer' ? 'Farmer' : 'Buyer'} Details</h2>
                    <div class="user-details-modal">
                        <div class="detail-row">
                            <strong>Name:</strong> ${user.name}
                        </div>
                        <div class="detail-row">
                            <strong>Email:</strong> ${user.email}
                        </div>
                        <div class="detail-row">
                            <strong>Phone:</strong> ${user.phone}
                        </div>
                        <div class="detail-row">
                            <strong>Location:</strong> ${getLocationDisplayName(user.location)}
                        </div>
                        <div class="detail-row">
                            <strong>Type:</strong> ${user.type.charAt(0).toUpperCase() + user.type.slice(1)}
                        </div>
                        <div class="detail-row">
                            <strong>Status:</strong> ${user.approved ? 'Approved' : 'Pending'}
                        </div>
                        <div class="detail-row">
                            <strong>Join Date:</strong> ${formatDate(user.createdAt)}
                        </div>
                        <div class="detail-row">
                            <strong>Total Products:</strong> ${userProducts.length}
                        </div>
                        <div class="detail-row">
                            <strong>Total Orders:</strong> ${userOrders.length}
                        </div>
                        ${user.suspended ? '<div class="detail-row"><strong>⚠️ Suspended</strong></div>' : ''}
                    </div>
                    <div class="action-buttons" style="justify-content: center;">
                        ${user.type === 'farmer' && !user.approved ? `
                            <button class="btn btn-approve" onclick="approveFarmer('${user.id}'); closeModal('userDetailsModal');">Approve</button>
                            <button class="btn btn-reject" onclick="rejectFarmer('${user.id}'); closeModal('userDetailsModal');">Reject</button>
                        ` : ''}
                        ${!user.suspended ? `
                            <button class="btn btn-suspend" onclick="suspend${user.type === 'farmer' ? 'Farmer' : 'Buyer'}('${user.id}'); closeModal('userDetailsModal');">Suspend</button>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
        
        // Remove existing modal if any
        const existingModal = document.getElementById('userDetailsModal');
        if (existingModal) {
            existingModal.remove();
        }
        
        // Add new modal to body
        document.body.insertAdjacentHTML('beforeend', modalHtml);
        document.getElementById('userDetailsModal').style.display = 'block';
    }
}

// Product Management Functions
function approveProduct(productId) {
    if (confirm('Are you sure you want to approve this product?')) {
        const productIndex = allProducts.findIndex(product => product.id === productId);
        if (productIndex !== -1) {
            allProducts[productIndex].status = 'approved';
            allProducts[productIndex].approvedAt = new Date().toISOString();
            localStorage.setItem('agrilinkProducts', JSON.stringify(allProducts));
            
            showNotification('Product approved successfully!', 'success');
            loadPlatformData();
            loadProductsTable();
        }
    }
}

function rejectProduct(productId) {
    const reason = prompt('Please provide a reason for rejection:');
    if (reason) {
        const productIndex = allProducts.findIndex(product => product.id === productId);
        if (productIndex !== -1) {
            allProducts[productIndex].status = 'rejected';
            allProducts[productIndex].rejectionReason = reason;
            allProducts[productIndex].rejectedAt = new Date().toISOString();
            localStorage.setItem('agrilinkProducts', JSON.stringify(allProducts));
            
            showNotification('Product rejected.', 'info');
            loadPlatformData();
            loadProductsTable();
        }
    }
}

function suspendProduct(productId) {
    if (confirm('Are you sure you want to suspend this product?')) {
        const productIndex = allProducts.findIndex(product => product.id === productId);
        if (productIndex !== -1) {
            allProducts[productIndex].status = 'suspended';
            allProducts[productIndex].suspendedAt = new Date().toISOString();
            localStorage.setItem('agrilinkProducts', JSON.stringify(allProducts));
            
            showNotification('Product suspended.', 'warning');
            loadPlatformData();
            loadProductsTable();
        }
    }
}

function deleteProduct(productId) {
    if (confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
        allProducts = allProducts.filter(product => product.id !== productId);
        localStorage.setItem('agrilinkProducts', JSON.stringify(allProducts));
        
        showNotification('Product deleted successfully.', 'success');
        loadPlatformData();
        loadProductsTable();
    }
}

function viewProductDetails(productId) {
    const product = allProducts.find(p => p.id === productId);
    if (product) {
        sessionStorage.setItem('selectedProduct', JSON.stringify(product));
        window.location.href = 'product-detail.html';
    }
}

// Order Management Functions
function viewOrderDetails(orderId) {
    const order = allOrders.find(o => o.id === orderId);
    if (order) {
        const modalHtml = `
            <div id="orderDetailsModal" class="modal">
                <div class="modal-content">
                    <span class="close" onclick="closeModal('orderDetailsModal')">&times;</span>
                    <h2>Order Details</h2>
                    <div class="user-details-modal">
                        <div class="detail-row">
                            <strong>Order ID:</strong> #${order.id}
                        </div>
                        <div class="detail-row">
                            <strong>Product:</strong> ${order.productName}
                        </div>
                        <div class="detail-row">
                            <strong>Buyer:</strong> ${order.buyerName}
                        </div>
                        <div class="detail-row">
                            <strong>Buyer Phone:</strong> ${order.buyerPhone}
                        </div>
                        <div class="detail-row">
                            <strong>Farmer:</strong> ${order.farmerName || 'Unknown'}
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

function refundOrder(orderId) {
    if (confirm('Are you sure you want to process a refund for this order?')) {
        const orderIndex = allOrders.findIndex(order => order.id === orderId);
        if (orderIndex !== -1) {
            allOrders[orderIndex].status = 'refunded';
            allProducts[orderIndex].refundedAt = new Date().toISOString();
            localStorage.setItem('agrilinkOrders', JSON.stringify(allOrders));
            
            showNotification('Refund processed successfully.', 'success');
            loadPlatformData();
            loadOrdersTable();
            
            // Close modal if open
            const modal = document.getElementById('orderDetailsModal');
            if (modal) {
                modal.style.display = 'none';
            }
        }
    }
}

// Filter and Search Functions
function filterFarmers() {
    const statusFilter = document.getElementById('farmerStatusFilter').value;
    const locationFilter = document.getElementById('farmerLocationFilter').value;
    
    filteredData.farmers = allUsers.filter(user => user.type === 'farmer');
    
    if (statusFilter) {
        filteredData.farmers = filteredData.farmers.filter(farmer => {
            if (statusFilter === 'approved') return farmer.approved;
            if (statusFilter === 'pending') return !farmer.approved;
            if (statusFilter === 'suspended') return farmer.suspended;
            return true;
        });
    }
    
    if (locationFilter) {
        filteredData.farmers = filteredData.farmers.filter(farmer => farmer.location === locationFilter);
    }
    
    loadFarmersTable();
}

function filterBuyers() {
    const statusFilter = document.getElementById('buyerStatusFilter').value;
    
    filteredData.buyers = allUsers.filter(user => user.type === 'buyer');
    
    if (statusFilter) {
        filteredData.buyers = filteredData.buyers.filter(buyer => {
            if (statusFilter === 'suspended') return buyer.suspended;
            return true;
        });
    }
    
    loadBuyersTable();
}

function filterProducts() {
    const statusFilter = document.getElementById('productStatusFilter').value;
    const categoryFilter = document.getElementById('productCategoryFilter').value;
    
    filteredData.products = [...allProducts];
    
    if (statusFilter) {
        filteredData.products = filteredData.products.filter(product => 
            (product.status || 'pending') === statusFilter
        );
    }
    
    if (categoryFilter) {
        filteredData.products = filteredData.products.filter(product => product.category === categoryFilter);
    }
    
    loadProductsTable();
}

function filterOrders() {
    const statusFilter = document.getElementById('orderStatusFilter').value;
    
    filteredData.orders = [...allOrders];
    
    if (statusFilter) {
        filteredData.orders = filteredData.orders.filter(order => order.status === statusFilter);
    }
    
    loadOrdersTable();
}

function searchFarmers() {
    const searchTerm = document.getElementById('farmerSearch').value.toLowerCase();
    
    filteredData.farmers = allUsers.filter(user => user.type === 'farmer');
    
    if (searchTerm) {
        filteredData.farmers = filteredData.farmers.filter(farmer => 
            farmer.name.toLowerCase().includes(searchTerm) ||
            farmer.email.toLowerCase().includes(searchTerm) ||
            farmer.phone.includes(searchTerm)
        );
    }
    
    loadFarmersTable();
}

function searchBuyers() {
    const searchTerm = document.getElementById('buyerSearch').value.toLowerCase();
    
    filteredData.buyers = allUsers.filter(user => user.type === 'buyer');
    
    if (searchTerm) {
        filteredData.buyers = filteredData.buyers.filter(buyer => 
            buyer.name.toLowerCase().includes(searchTerm) ||
            buyer.email.toLowerCase().includes(searchTerm) ||
            buyer.phone.includes(searchTerm)
        );
    }
    
    loadBuyersTable();
}

function searchProducts() {
    const searchTerm = document.getElementById('productSearch').value.toLowerCase();
    
    filteredData.products = [...allProducts];
    
    if (searchTerm) {
        filteredData.products = filteredData.products.filter(product => 
            product.title.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm) ||
            product.farmer.name.toLowerCase().includes(searchTerm)
        );
    }
    
    loadProductsTable();
}

function searchOrders() {
    const searchTerm = document.getElementById('orderSearch').value.toLowerCase();
    
    filteredData.orders = [...allOrders];
    
    if (searchTerm) {
        filteredData.orders = filteredData.orders.filter(order => 
            order.id.toString().includes(searchTerm) ||
            order.productName.toLowerCase().includes(searchTerm) ||
            order.buyerName.toLowerCase().includes(searchTerm) ||
            order.farmerName?.toLowerCase().includes(searchTerm)
        );
    }
    
    loadOrdersTable();
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

function getLocationDisplayName(location) {
    const locationNames = {
        'addis-ababa': 'Addis Ababa',
        'dire-dawa': 'Dire Dawa',
        'mekelle': 'Mekelle',
        'gondar': 'Gondar',
        'bahirdar': 'Bahirdar',
        'hawassa': 'Hawassa'
    };
    return locationNames[location] || location;
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

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('agrilinkUser');
        window.location.href = 'index.html';
    }
}

// Generate sample data for demonstration
function generateSampleData() {
    // Generate sample users if none exist
    if (allUsers.length === 0) {
        const sampleUsers = [
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
                approved: false,
                createdAt: new Date().toISOString()
            },
            {
                id: 'buyer1',
                type: 'buyer',
                name: 'Restaurant Owner',
                email: 'restaurant@example.com',
                phone: '+251912345678',
                location: 'addis-ababa',
                password: 'password123',
                approved: true,
                createdAt: new Date().toISOString()
            }
        ];
        
        localStorage.setItem('agrilinkUsers', JSON.stringify(sampleUsers));
        allUsers = sampleUsers;
    }
    
    // Generate sample orders if none exist
    if (allOrders.length === 0) {
        const sampleOrders = [
            {
                id: '1001',
                productId: '1',
                productName: 'Fresh Red Tomatoes',
                farmerId: 'farmer1',
                farmerName: 'Abebe Kebede',
                buyerId: 'buyer1',
                buyerName: 'Restaurant Owner',
                buyerPhone: '+251912345678',
                quantity: '50 kg',
                totalPrice: 1250,
                status: 'new',
                date: new Date().toISOString(),
                deliveryAddress: 'Bole, Addis Ababa'
            },
            {
                id: '1002',
                productId: '2',
                productName: 'Organic Potatoes',
                farmerId: 'farmer1',
                farmerName: 'Abebe Kebede',
                buyerId: 'buyer1',
                buyerName: 'Restaurant Owner',
                buyerPhone: '+251912345678',
                quantity: '100 kg',
                totalPrice: 1800,
                status: 'processing',
                date: new Date(Date.now() - 86400000).toISOString(),
                deliveryAddress: 'Mekelle, Tigray'
            }
        ];
        
        localStorage.setItem('agrilinkOrders', JSON.stringify(sampleOrders));
        allOrders = sampleOrders;
    }
}

// Settings Functions
function loadSettingsContent() {
    showSettingsTab('general');
}

function showSettingsTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Find and activate the clicked button - handle case where event might not be defined
    const buttons = document.querySelectorAll('.tab-btn');
    buttons.forEach((btn, index) => {
        if ((tabName === 'general' && index === 0) ||
            (tabName === 'approval' && index === 1) ||
            (tabName === 'payment' && index === 2) ||
            (tabName === 'notification' && index === 3)) {
            btn.classList.add('active');
        }
    });
    
    const settingsContent = document.getElementById('settingsContent');
    
    switch(tabName) {
        case 'general':
            settingsContent.innerHTML = `
                <div class="settings-section">
                    <h3>🏠 General Settings</h3>
                    <form onsubmit="saveGeneralSettings(event)">
                        <div class="form-group">
                            <label>Platform Name</label>
                            <input type="text" id="platformName" value="AgrilinkEthiopia" required>
                        </div>
                        <div class="form-group">
                            <label>Platform Email</label>
                            <input type="email" id="platformEmail" value="info@agrilinkethiopia.et" required>
                        </div>
                        <div class="form-group">
                            <label>Platform Phone</label>
                            <input type="tel" id="platformPhone" value="+251 911 234 567" required>
                        </div>
                        <div class="form-group">
                            <label>Support Hours</label>
                            <input type="text" id="supportHours" value="Mon-Fri: 8AM-6PM" required>
                        </div>
                        <button type="submit" class="btn btn-primary">💾 Save Settings</button>
                    </form>
                </div>
            `;
            break;
            
        case 'approval':
            settingsContent.innerHTML = `
                <div class="settings-section">
                    <h3>✅ Approval Settings</h3>
                    <form onsubmit="saveApprovalSettings(event)">
                        <div class="form-group">
                            <label>Auto-approve Buyers</label>
                            <label class="switch">
                                <input type="checkbox" id="autoApproveBuyers" checked>
                                <span class="slider"></span>
                            </label>
                            <p style="font-size: 0.9rem; color: #666; margin-top: 0.5rem;">Enable automatic approval for new buyer accounts</p>
                        </div>
                        <div class="form-group">
                            <label>Auto-approve Farmers</label>
                            <label class="switch">
                                <input type="checkbox" id="autoApproveFarmers">
                                <span class="slider"></span>
                            </label>
                            <p style="font-size: 0.9rem; color: #666; margin-top: 0.5rem;">Enable automatic approval for new farmer accounts (not recommended)</p>
                        </div>
                        <div class="form-group">
                            <label>Require Farmer Documentation</label>
                            <label class="switch">
                                <input type="checkbox" id="requireFarmerDocs" checked>
                                <span class="slider"></span>
                            </label>
                            <p style="font-size: 0.9rem; color: #666; margin-top: 0.5rem;">Require farmers to upload verification documents</p>
                        </div>
                        <button type="submit" class="btn btn-primary">💾 Save Settings</button>
                    </form>
                </div>
            `;
            break;
            
        case 'payment':
            settingsContent.innerHTML = `
                <div class="settings-section">
                    <h3>💳 Payment Settings</h3>
                    <form onsubmit="savePaymentSettings(event)">
                        <div class="form-group">
                            <label>Enable TeleBirr</label>
                            <label class="switch">
                                <input type="checkbox" id="enableTeleBirr" checked>
                                <span class="slider"></span>
                            </label>
                            <p style="font-size: 0.9rem; color: #666; margin-top: 0.5rem;">Allow payments through TeleBirr mobile money</p>
                        </div>
                        <div class="form-group">
                            <label>Enable CBE Birr</label>
                            <label class="switch">
                                <input type="checkbox" id="enableCBEBirr" checked>
                                <span class="slider"></span>
                            </label>
                            <p style="font-size: 0.9rem; color: #666; margin-top: 0.5rem;">Allow payments through CBE Birr mobile money</p>
                        </div>
                        <div class="form-group">
                            <label>Enable Cash on Delivery</label>
                            <label class="switch">
                                <input type="checkbox" id="enableCOD" checked>
                                <span class="slider"></span>
                            </label>
                            <p style="font-size: 0.9rem; color: #666; margin-top: 0.5rem;">Allow cash payments upon delivery</p>
                        </div>
                        <div class="form-group">
                            <label>Platform Commission (%)</label>
                            <input type="number" id="platformCommission" value="5" min="0" max="30" step="0.5" required>
                            <p style="font-size: 0.9rem; color: #666; margin-top: 0.5rem;">Percentage fee charged on each transaction</p>
                        </div>
                        <div class="form-group">
                            <label>Minimum Transaction Amount (ETB)</label>
                            <input type="number" id="minTransaction" value="100" min="10" required>
                            <p style="font-size: 0.9rem; color: #666; margin-top: 0.5rem;">Minimum amount for transactions</p>
                        </div>
                        <button type="submit" class="btn btn-primary">💾 Save Settings</button>
                    </form>
                </div>
            `;
            break;
            
        case 'notification':
            settingsContent.innerHTML = `
                <div class="settings-section">
                    <h3>🔔 Notification Settings</h3>
                    <form onsubmit="saveNotificationSettings(event)">
                        <div class="form-group">
                            <label>Email Notifications</label>
                            <label class="switch">
                                <input type="checkbox" id="emailNotifications" checked>
                                <span class="slider"></span>
                            </label>
                            <p style="font-size: 0.9rem; color: #666; margin-top: 0.5rem;">Send email for new registrations, orders, etc.</p>
                        </div>
                        <div class="form-group">
                            <label>SMS Notifications</label>
                            <label class="switch">
                                <input type="checkbox" id="smsNotifications" checked>
                                <span class="slider"></span>
                            </label>
                            <p style="font-size: 0.9rem; color: #666; margin-top: 0.5rem;">Send SMS alerts to farmers and buyers</p>
                        </div>
                        <div class="form-group">
                            <label>Notify on New Farmer Registration</label>
                            <label class="switch">
                                <input type="checkbox" id="notifyNewFarmer" checked>
                                <span class="slider"></span>
                            </label>
                        </div>
                        <div class="form-group">
                            <label>Notify on Product Approval Required</label>
                            <label class="switch">
                                <input type="checkbox" id="notifyProductApproval" checked>
                                <span class="slider"></span>
                            </label>
                        </div>
                        <div class="form-group">
                            <label>Notify on New Order</label>
                            <label class="switch">
                                <input type="checkbox" id="notifyNewOrder" checked>
                                <span class="slider"></span>
                            </label>
                        </div>
                        <div class="form-group">
                            <label>Admin Email for Alerts</label>
                            <input type="email" id="adminEmail" value="admin@agrilinkethiopia.et" required>
                            <p style="font-size: 0.9rem; color: #666; margin-top: 0.5rem;">Email address to receive admin notifications</p>
                        </div>
                        <button type="submit" class="btn btn-primary">💾 Save Settings</button>
                    </form>
                </div>
            `;
            break;
            
        default:
            settingsContent.innerHTML = `
                <div class="settings-section">
                    <h3>Settings</h3>
                    <p>Select a settings category from the tabs above.</p>
                </div>
            `;
    }
}

function saveGeneralSettings(event) {
    event.preventDefault();
    showNotification('General settings saved successfully!', 'success');
}

function saveApprovalSettings(event) {
    event.preventDefault();
    showNotification('Approval settings saved successfully!', 'success');
}

function savePaymentSettings(event) {
    event.preventDefault();
    showNotification('Payment settings saved successfully!', 'success');
}

function saveNotificationSettings(event) {
    event.preventDefault();
    showNotification('Notification settings saved successfully!', 'success');
}

// Generate sample data on first load
generateSampleData();