// AgrilinkEthiopia - Buyer Dashboard JavaScript

let currentUser = null;
let myOrders = [];
let myWishlist = [];
let allProducts = [];

// Initialize the buyer dashboard
document.addEventListener('DOMContentLoaded', function() {
    initializeBuyerDashboard();
});

function initializeBuyerDashboard() {
    // Check if user is logged in and is a buyer
    const savedUser = localStorage.getItem('agrilinkUser');
    if (!savedUser) {
        window.location.href = 'index.html';
        return;
    }
    
    currentUser = JSON.parse(savedUser);
    if (currentUser.type !== 'buyer') {
        window.location.href = 'index.html';
        return;
    }
    
    // Update UI with buyer info
    document.getElementById('buyerName').textContent = currentUser.name;
    
    // Load buyer's data
    loadBuyerData();
    
    // Show dashboard section by default
    showSection('dashboard');
}

function loadBuyerData() {
    // Load all products
    allProducts = JSON.parse(localStorage.getItem('agrilinkProducts') || '[]');
    
    // Load buyer's orders
    const allOrders = JSON.parse(localStorage.getItem('agrilinkOrders') || '[]');
    myOrders = allOrders.filter(order => order.buyerId === currentUser.id);
    
    // Load buyer's wishlist
    const allWishlists = JSON.parse(localStorage.getItem('agrilinkWishlists') || '[]');
    const myWishlistData = allWishlists.find(wishlist => wishlist.buyerId === currentUser.id);
    myWishlist = myWishlistData ? myWishlistData.products : [];
    
    // Update dashboard stats
    updateDashboardStats();
    
    // Load recent orders and recommended products
    loadRecentOrders();
    loadRecommendedProducts();
    
    // Load orders and wishlist tables
    loadOrdersTable();
    loadWishlist();
}

function updateDashboardStats() {
    // Total orders
    document.getElementById('totalOrders').textContent = myOrders.length;
    
    // Active orders
    const activeOrders = myOrders.filter(order => 
        order.status === 'new' || order.status === 'processing'
    );
    document.getElementById('activeOrders').textContent = activeOrders.length;
    
    // Total spent
    const completedOrders = myOrders.filter(order => order.status === 'completed');
    const totalSpent = completedOrders.reduce((total, order) => total + order.totalPrice, 0);
    document.getElementById('totalSpent').textContent = `ETB ${totalSpent.toLocaleString()}`;
    
    // Saved products (wishlist)
    document.getElementById('savedProducts').textContent = myWishlist.length;
}

function loadRecentOrders() {
    const recentOrdersContainer = document.getElementById('recentOrders');
    if (!recentOrdersContainer) return;
    
    const recentOrders = myOrders.slice(0, 5).sort((a, b) => new Date(b.date) - new Date(a.date));
    
    if (recentOrders.length === 0) {
        recentOrdersContainer.innerHTML = '<p style="color: #666; text-align: center; padding: 2rem;">No orders yet. Start browsing products to place your first order!</p>';
        return;
    }
    
    recentOrdersContainer.innerHTML = `
        <table class="orders-table">
            <thead>
                <tr>
                    <th>Order ID</th>
                    <th>Product</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${recentOrders.map(order => `
                    <tr>
                        <td>#${order.id}</td>
                        <td>${order.productName}</td>
                        <td>ETB ${order.totalPrice.toLocaleString()}</td>
                        <td>
                            <span class="order-status ${order.status}">
                                ${order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </span>
                        </td>
                        <td>
                            <div class="action-buttons">
                                <button class="btn btn-small btn-primary" onclick="viewOrderDetails('${order.id}')">View</button>
                                ${order.status === 'new' ? `<button class="btn btn-small" style="background: #e74c3c; color: white;" onclick="cancelOrder('${order.id}')">Cancel</button>` : ''}
                            </div>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

function loadRecommendedProducts() {
    const recommendedContainer = document.getElementById('recommendedProducts');
    if (!recommendedContainer) return;
    
    // Get recommended products (available products, not in wishlist, random selection)
    const availableProducts = allProducts.filter(product => 
        product.available && 
        (product.status === 'approved' || !product.status)
    );
    
    const recommendedProducts = availableProducts
        .filter(product => !myWishlist.find(wishlistItem => wishlistItem.id === product.id))
        .sort(() => Math.random() - 0.5)
        .slice(0, 4);
    
    if (recommendedProducts.length === 0) {
        recommendedContainer.innerHTML = '<p style="color: #666; text-align: center; padding: 2rem;">No recommended products available at the moment.</p>';
        return;
    }
    
    recommendedContainer.innerHTML = `
        <div class="wishlist-grid">
            ${recommendedProducts.map(product => `
                <div class="wishlist-item" onclick="viewProduct('${product.id}')">
                    <div class="wishlist-image">
                        <img src="${product.images[0]}" alt="${product.title}">
                    </div>
                    <div class="wishlist-info">
                        <div class="wishlist-title">${product.title}</div>
                        <div class="wishlist-price">ETB ${product.price}/kg</div>
                        <div class="wishlist-farmer">by ${product.farmer.name}</div>
                        <div class="action-buttons">
                            <button class="btn btn-small btn-primary" onclick="contactFarmer('${product.id}', event)">Contact</button>
                            <button class="btn btn-small btn-outline" onclick="addToWishlist('${product.id}', event)">Save</button>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

function loadOrdersTable() {
    const ordersTableBody = document.getElementById('ordersTableBody');
    if (!ordersTableBody) return;
    
    if (myOrders.length === 0) {
        ordersTableBody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center; padding: 2rem; color: #666;">
                    No orders found. Start browsing products to place your first order.
                </td>
            </tr>
        `;
        return;
    }
    
    ordersTableBody.innerHTML = myOrders.map(order => `
        <tr>
            <td>#${order.id}</td>
            <td>${order.productName}</td>
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
                    <button class="btn btn-small btn-primary" onclick="viewOrderDetails('${order.id}')">View</button>
                    ${order.status === 'new' ? `<button class="btn btn-small" style="background: #e74c3c; color: white;" onclick="cancelOrder('${order.id}')">Cancel</button>` : ''}
                    ${order.status === 'completed' ? `<button class="btn btn-small btn-outline" onclick="reorderProduct('${order.productId}')">Reorder</button>` : ''}
                </div>
            </td>
        </tr>
    `).join('');
}

function loadWishlist() {
    const wishlistGrid = document.getElementById('wishlistGrid');
    if (!wishlistGrid) return;
    
    if (myWishlist.length === 0) {
        wishlistGrid.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; color: #666;">Your wishlist is empty. Start browsing and save products you like!</p>';
        return;
    }
    
    // Get full product details for wishlist items
    const wishlistProducts = myWishlist.map(wishlistItem => {
        const product = allProducts.find(p => p.id === wishlistItem.id);
        return product || wishlistItem;
    }).filter(product => product);
    
    wishlistGrid.innerHTML = wishlistProducts.map(product => `
        <div class="wishlist-item" onclick="viewProduct('${product.id}')">
            <div class="wishlist-image">
                <img src="${product.images[0]}" alt="${product.title}">
            </div>
            <div class="wishlist-info">
                <div class="wishlist-title">${product.title}</div>
                <div class="wishlist-price">ETB ${product.price}/kg</div>
                <div class="wishlist-farmer">by ${product.farmer.name}</div>
                <div class="action-buttons">
                    <button class="btn btn-small btn-primary" onclick="contactFarmer('${product.id}', event)">Contact</button>
                    <button class="btn btn-small" style="background: #e74c3c; color: white;" onclick="removeFromWishlist('${product.id}', event)">Remove</button>
                </div>
            </div>
        </div>
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
            loadRecentOrders();
            loadRecommendedProducts();
            break;
        case 'orders':
            loadOrdersTable();
            break;
        case 'wishlist':
            loadWishlist();
            break;
        case 'browse':
            // Redirect to main page
            window.location.href = 'index.html#products';
            break;
        case 'profile':
            showProfileSection();
            break;
    }
}

function showMobileMenu() {
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
        sidebar.classList.toggle('active');
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
                            <strong>Farmer:</strong> ${order.farmerName || 'Unknown'}
                        </div>
                        <div class="detail-row">
                            <strong>Farmer Phone:</strong> ${order.farmerPhone || 'Not provided'}
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
                    <div class="order-actions">
                        ${order.status === 'new' ? `
                            <button class="btn btn-primary" onclick="proceedWithPayment('${order.id}')">Pay Now</button>
                            <button class="btn" style="background: #e74c3c; color: white;" onclick="cancelOrder('${order.id}'); closeModal('orderDetailsModal');">Cancel Order</button>
                        ` : ''}
                        ${order.status === 'processing' ? `
                            <button class="btn btn-outline" onclick="trackOrder('${order.id}')">Track Order</button>
                        ` : ''}
                        ${order.status === 'completed' ? `
                            <button class="btn btn-primary" onclick="reorderProduct('${order.productId}'); closeModal('orderDetailsModal');">Order Again</button>
                            <button class="btn btn-outline" onclick="leaveReview('${order.id}')">Leave Review</button>
                        ` : ''}
                        <button class="btn btn-outline" onclick="contactFarmer('${order.productId}')">Contact Farmer</button>
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

function cancelOrder(orderId) {
    if (confirm('Are you sure you want to cancel this order?')) {
        const allOrders = JSON.parse(localStorage.getItem('agrilinkOrders') || '[]');
        const orderIndex = allOrders.findIndex(o => o.id === orderId);
        
        if (orderIndex !== -1) {
            allOrders[orderIndex].status = 'cancelled';
            allOrders[orderIndex].cancelledAt = new Date().toISOString();
            localStorage.setItem('agrilinkOrders', JSON.stringify(allOrders));
            
            // Update local orders array
            const localOrderIndex = myOrders.findIndex(o => o.id === orderId);
            if (localOrderIndex !== -1) {
                myOrders[localOrderIndex].status = 'cancelled';
            }
            
            showNotification('Order cancelled successfully.', 'info');
            loadOrdersTable();
            loadRecentOrders();
            updateDashboardStats();
        }
    }
}

function reorderProduct(productId) {
    const product = allProducts.find(p => p.id === productId);
    if (product) {
        sessionStorage.setItem('selectedProduct', JSON.stringify(product));
        window.location.href = 'product-detail.html';
    }
}

function proceedWithPayment(orderId) {
    // Create payment modal
    const modalHtml = `
        <div id="paymentModal" class="modal">
            <div class="modal-content">
                <span class="close" onclick="closeModal('paymentModal')">&times;</span>
                <h2>Complete Payment</h2>
                <div class="payment-options">
                    <h3>Select Payment Method</h3>
                    <div class="payment-methods" style="display: flex; flex-direction: column; gap: 1rem; margin: 1rem 0;">
                        <label class="payment-option">
                            <input type="radio" name="paymentMethod" value="telebirr" checked>
                            <span>📱 TeleBirr</span>
                        </label>
                        <label class="payment-option">
                            <input type="radio" name="paymentMethod" value="cbe-birr">
                            <span>📱 CBE Birr</span>
                        </label>
                        <label class="payment-option">
                            <input type="radio" name="paymentMethod" value="cash-delivery">
                            <span>💵 Cash on Delivery</span>
                        </label>
                        <label class="payment-option">
                            <input type="radio" name="paymentMethod" value="bank-transfer">
                            <span>🏦 Bank Transfer</span>
                        </label>
                    </div>
                    <button class="btn btn-primary btn-full" onclick="processPayment('${orderId}')">Proceed to Payment</button>
                </div>
            </div>
        </div>
    `;
    
    // Remove existing modal if any
    const existingModal = document.getElementById('paymentModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Add new modal to body
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    document.getElementById('paymentModal').style.display = 'block';
}

function processPayment(orderId) {
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
    
    // Update order status
    const allOrders = JSON.parse(localStorage.getItem('agrilinkOrders') || '[]');
    const orderIndex = allOrders.findIndex(o => o.id === orderId);
    
    if (orderIndex !== -1) {
        allOrders[orderIndex].status = 'processing';
        allOrders[orderIndex].paymentMethod = paymentMethod;
        allOrders[orderIndex].paidAt = new Date().toISOString();
        localStorage.setItem('agrilinkOrders', JSON.stringify(allOrders));
        
        // Update local orders array
        const localOrderIndex = myOrders.findIndex(o => o.id === orderId);
        if (localOrderIndex !== -1) {
            myOrders[localOrderIndex].status = 'processing';
            myOrders[localOrderIndex].paymentMethod = paymentMethod;
        }
        
        showNotification(`Payment initiated successfully! You will be redirected to complete your ${paymentMethod.replace('-', ' ')} payment.`, 'success');
        
        // Close modals
        closeModal('paymentModal');
        closeModal('orderDetailsModal');
        
        // Update UI
        loadOrdersTable();
        loadRecentOrders();
        updateDashboardStats();
        
        // Simulate redirect to payment gateway
        setTimeout(() => {
            showNotification('This is a demo. In production, you would be redirected to the actual payment gateway.', 'info');
        }, 2000);
    }
}

// Wishlist Functions
function addToWishlist(productId, event) {
    if (event) {
        event.stopPropagation();
    }
    
    const product = allProducts.find(p => p.id === productId);
    if (!product) return;
    
    // Check if already in wishlist
    if (myWishlist.find(item => item.id === productId)) {
        showNotification('Product is already in your wishlist.', 'info');
        return;
    }
    
    // Add to wishlist
    myWishlist.push({
        id: product.id,
        title: product.title,
        price: product.price,
        farmer: product.farmer,
        images: product.images,
        addedAt: new Date().toISOString()
    });
    
    // Save to localStorage
    const allWishlists = JSON.parse(localStorage.getItem('agrilinkWishlists') || '[]');
    const myWishlistIndex = allWishlists.findIndex(wishlist => wishlist.buyerId === currentUser.id);
    
    if (myWishlistIndex !== -1) {
        allWishlists[myWishlistIndex].products = myWishlist;
    } else {
        allWishlists.push({
            buyerId: currentUser.id,
            products: myWishlist
        });
    }
    
    localStorage.setItem('agrilinkWishlists', JSON.stringify(allWishlists));
    
    showNotification('Product added to wishlist!', 'success');
    updateDashboardStats();
    
    // Reload recommended products if on dashboard
    if (document.getElementById('recommendedProducts')) {
        loadRecommendedProducts();
    }
}

function removeFromWishlist(productId, event) {
    if (event) {
        event.stopPropagation();
    }
    
    if (confirm('Are you sure you want to remove this product from your wishlist?')) {
        myWishlist = myWishlist.filter(item => item.id !== productId);
        
        // Save to localStorage
        const allWishlists = JSON.parse(localStorage.getItem('agrilinkWishlists') || '[]');
        const myWishlistIndex = allWishlists.findIndex(wishlist => wishlist.buyerId === currentUser.id);
        
        if (myWishlistIndex !== -1) {
            allWishlists[myWishlistIndex].products = myWishlist;
            localStorage.setItem('agrilinkWishlists', JSON.stringify(allWishlists));
        }
        
        showNotification('Product removed from wishlist.', 'info');
        loadWishlist();
        updateDashboardStats();
    }
}

// Product Functions
function viewProduct(productId) {
    const product = allProducts.find(p => p.id === productId);
    if (product) {
        sessionStorage.setItem('selectedProduct', JSON.stringify(product));
        window.location.href = 'product-detail.html';
    }
}

function contactFarmer(productId, event) {
    if (event) {
        event.stopPropagation();
    }
    
    const product = allProducts.find(p => p.id === productId);
    if (product) {
        sessionStorage.setItem('selectedProduct', JSON.stringify(product));
        window.location.href = 'product-detail.html';
    }
}

// Profile Functions
function showProfileSection() {
    const profileSection = document.getElementById('profile-section');
    if (!profileSection) return;
    
    profileSection.innerHTML = `
        <div class="section-card">
            <div class="section-header">
                <h2>My Profile</h2>
                <button class="btn btn-outline" onclick="editProfile()">Edit Profile</button>
            </div>
            <div class="profile-info">
                <div class="user-info">
                    <div class="user-avatar" style="width: 80px; height: 80px; font-size: 2rem;">${currentUser.name.charAt(0)}</div>
                    <div>
                        <h3>${currentUser.name}</h3>
                        <p>${currentUser.email}</p>
                        <p>📱 ${currentUser.phone}</p>
                        <p>📍 ${getLocationDisplayName(currentUser.location)}</p>
                    </div>
                </div>
                <div class="profile-stats">
                    <div class="stat-card">
                        <h3>Member Since</h3>
                        <div class="stat-value">${formatDate(currentUser.createdAt)}</div>
                    </div>
                    <div class="stat-card">
                        <h3>Total Orders</h3>
                        <div class="stat-value">${myOrders.length}</div>
                    </div>
                    <div class="stat-card">
                        <h3>Total Spent</h3>
                        <div class="stat-value">ETB ${myOrders.filter(o => o.status === 'completed').reduce((total, o) => total + o.totalPrice, 0).toLocaleString()}</div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function editProfile() {
    // Create edit profile modal
    const modalHtml = `
        <div id="editProfileModal" class="modal">
            <div class="modal-content">
                <span class="close" onclick="closeModal('editProfileModal')">&times;</span>
                <h2>Edit Profile</h2>
                <form onsubmit="handleProfileUpdate(event)">
                    <div class="form-group">
                        <label for="editName">Full Name</label>
                        <input type="text" id="editName" value="${currentUser.name}" required>
                    </div>
                    <div class="form-group">
                        <label for="editPhone">Phone Number</label>
                        <input type="tel" id="editPhone" value="${currentUser.phone}" required>
                    </div>
                    <div class="form-group">
                        <label for="editLocation">Location</label>
                        <select id="editLocation" required>
                            <option value="addis-ababa" ${currentUser.location === 'addis-ababa' ? 'selected' : ''}>Addis Ababa</option>
                            <option value="dire-dawa" ${currentUser.location === 'dire-dawa' ? 'selected' : ''}>Dire Dawa</option>
                            <option value="mekelle" ${currentUser.location === 'mekelle' ? 'selected' : ''}>Mekelle</option>
                            <option value="gondar" ${currentUser.location === 'gondar' ? 'selected' : ''}>Gondar</option>
                            <option value="bahirdar" ${currentUser.location === 'bahirdar' ? 'selected' : ''}>Bahirdar</option>
                            <option value="hawassa" ${currentUser.location === 'hawassa' ? 'selected' : ''}>Hawassa</option>
                        </select>
                    </div>
                    <button type="submit" class="btn btn-primary btn-full">Update Profile</button>
                </form>
            </div>
        </div>
    `;
    
    // Remove existing modal if any
    const existingModal = document.getElementById('editProfileModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Add new modal to body
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    document.getElementById('editProfileModal').style.display = 'block';
}

function handleProfileUpdate(event) {
    event.preventDefault();
    
    // Update user data
    currentUser.name = document.getElementById('editName').value;
    currentUser.phone = document.getElementById('editPhone').value;
    currentUser.location = document.getElementById('editLocation').value;
    
    // Save to localStorage
    const allUsers = JSON.parse(localStorage.getItem('agrilinkUsers') || '[]');
    const userIndex = allUsers.findIndex(u => u.id === currentUser.id);
    
    if (userIndex !== -1) {
        allUsers[userIndex] = currentUser;
        localStorage.setItem('agrilinkUsers', JSON.stringify(allUsers));
        localStorage.setItem('agrilinkUser', JSON.stringify(currentUser));
    }
    
    showNotification('Profile updated successfully!', 'success');
    closeModal('editProfileModal');
    
    // Update UI
    document.getElementById('buyerName').textContent = currentUser.name;
    showProfileSection();
}

// Filter Functions
function filterOrders() {
    const statusFilter = document.getElementById('orderStatusFilter').value;
    
    let filteredOrders = [...myOrders];
    
    if (statusFilter) {
        filteredOrders = filteredOrders.filter(order => order.status === statusFilter);
    }
    
    // Update table with filtered orders
    const ordersTableBody = document.getElementById('ordersTableBody');
    if (filteredOrders.length === 0) {
        ordersTableBody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center; padding: 2rem; color: #666;">
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
                    <button class="btn btn-small btn-primary" onclick="viewOrderDetails('${order.id}')">View</button>
                    ${order.status === 'new' ? `<button class="btn btn-small" style="background: #e74c3c; color: white;" onclick="cancelOrder('${order.id}')">Cancel</button>` : ''}
                    ${order.status === 'completed' ? `<button class="btn btn-small btn-outline" onclick="reorderProduct('${order.productId}')">Reorder</button>` : ''}
                </div>
            </td>
        </tr>
    `).join('');
}

// Utility Functions
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

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('agrilinkUser');
        window.location.href = 'index.html';
    }
}

// Buyer Profile Form Functions
function loadBuyerProfile() {
    if (currentUser) {
        document.getElementById('buyerProfileName').value = currentUser.name || '';
        document.getElementById('buyerProfileEmail').value = currentUser.email || '';
        document.getElementById('buyerProfilePhone').value = currentUser.phone || '';
        document.getElementById('buyerProfileLocation').value = currentUser.location || '';
        document.getElementById('buyerBusinessName').value = currentUser.businessName || '';
        document.getElementById('buyerAddress').value = currentUser.address || '';
    }
}

function updateBuyerProfile(event) {
    event.preventDefault();
    
    // Get form values
    const updatedProfile = {
        name: document.getElementById('buyerProfileName').value,
        email: document.getElementById('buyerProfileEmail').value,
        phone: document.getElementById('buyerProfilePhone').value,
        location: document.getElementById('buyerProfileLocation').value,
        businessName: document.getElementById('buyerBusinessName').value,
        address: document.getElementById('buyerAddress').value
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
    
    // Update buyer name display
    document.getElementById('buyerName').textContent = currentUser.name;
    
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
                        loadBuyerProfile();
                    }
                }
            });
        });
        observer.observe(profileSection, { attributes: true });
    }
});

// Generate sample data for demonstration


// Add CSS for additional elements
const additionalCSS = `
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
        flex-wrap: wrap;
    }
    
    .payment-option {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1rem;
        border: 2px solid #e1e8ed;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .payment-option:hover,
    .payment-option input:checked + span {
        border-color: #3498db;
        background: #f8f9fa;
    }
    
    .profile-info {
        display: grid;
        grid-template-columns: auto 1fr;
        gap: 2rem;
        align-items: start;
    }
    
    .profile-stats {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 1rem;
    }
    
    @media (max-width: 768px) {
        .profile-info {
            grid-template-columns: 1fr;
            text-align: center;
        }
        
        .profile-stats {
            grid-template-columns: 1fr;
        }
    }
`;

const style = document.createElement('style');
style.textContent = additionalCSS;
document.head.appendChild(style);