// AgrilinkEthiopia - Agricultural Marketplace JavaScript

// Global variables
let currentUser = null;
let products = [];
let filteredProducts = [];
let currentPage = 1;
const productsPerPage = 12;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();

    setupEventListeners();
    // Modals should scroll, not drag
});

// Draggable Modal Functionality
function setupDraggableModals() {
    const draggables = document.querySelectorAll('.draggable-modal');
    
    draggables.forEach(draggable => {
        let isDragging = false;
        let currentX;
        let currentY;
        let initialX;
        let initialY;
        let xOffset = 0;
        let yOffset = 0;
        
        const dragHeader = draggable.querySelector('.modal-drag-header');
        
        dragHeader.addEventListener('mousedown', dragStart);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', dragEnd);
        
        function dragStart(e) {
            initialX = e.clientX - xOffset;
            initialY = e.clientY - yOffset;
            
            if (e.target === dragHeader || dragHeader.contains(e.target)) {
                isDragging = true;
            }
        }
        
        function drag(e) {
            if (isDragging) {
                e.preventDefault();
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;
                
                xOffset = currentX;
                yOffset = currentY;
                
                draggable.style.transform = `translate(${currentX}px, ${currentY}px)`;
            }
        }
        
        function dragEnd(e) {
            initialX = currentX;
            initialY = currentY;
            isDragging = false;
        }
    });
}

// Toggle Farmer Fields in Signup
function toggleFarmerFields() {
    const userType = document.querySelector('input[name="userType"]:checked').value;
    const profilePictureGroup = document.getElementById('profilePictureGroup');
    const farmInfoGroup = document.getElementById('farmInfoGroup');
    const experienceGroup = document.getElementById('experienceGroup');
    const profilePictureInput = document.getElementById('profilePicture');
    
    if (userType === 'farmer') {
        profilePictureGroup.style.display = 'block';
        farmInfoGroup.style.display = 'block';
        experienceGroup.style.display = 'block';
        // Make profile picture required for farmers
        if (profilePictureInput) {
            profilePictureInput.setAttribute('required', 'required');
        }
    } else {
        profilePictureGroup.style.display = 'none';
        farmInfoGroup.style.display = 'none';
        experienceGroup.style.display = 'none';
        // Remove required attribute for buyers
        if (profilePictureInput) {
            profilePictureInput.removeAttribute('required');
        }
    }
}

// Preview Profile Image
function previewProfileImage(event) {
    const file = event.target.files[0];
    const preview = document.getElementById('profilePreview');
    
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            preview.innerHTML = `<img src="${e.target.result}" style="width: 100px; height: 100px; border-radius: 50%; object-fit: cover;">`;
        };
        reader.readAsDataURL(file);
    }
}

function initializeApp() {
    // Check if user is logged in
    const savedUser = localStorage.getItem('agrilinkUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        updateUIForLoggedInUser();
    }
    
    // Load products from localStorage or use sample data
    // Load products from localStorage
    const savedProducts = localStorage.getItem('agrilinkProducts');
    if (savedProducts) {
        products = JSON.parse(savedProducts);
    }
    
    // Initialize filteredProducts with all approved products
    filteredProducts = products.filter(p => p.status === 'approved');
    
    // Display initial products
    displayProducts();
}

// Category filtering function - CRITICAL FOR CATEGORY FUNCTIONALITY
function filterByCategory(category) {
    // Filter products by category
    filteredProducts = products.filter(p => p.category === category && p.status === 'approved');
    currentPage = 1;
    
    // Update display
    displayProducts(filteredProducts);
    
    // Scroll to products section
    const productsSection = document.getElementById('products');
    if (productsSection) {
        productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    
    // Show notification
    const categoryName = getCategoryDisplayName(category);
    showNotification(`Showing ${filteredProducts.length} products in ${categoryName}`, 'info');
}

// Reset filter to show all products
function showAllProducts() {
    filteredProducts = products.filter(p => p.status === 'approved');
    currentPage = 1;
    displayProducts(filteredProducts);
}

function setupEventListeners() {
    // Mobile menu toggle
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    if (mobileToggle) {
        mobileToggle.addEventListener('click', toggleMobileMenu);
    }
    
    // Search functionality
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keyup', debounce(searchProducts, 300));
    }
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Close modals when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            closeAllModals();
        }
    });
    
    // Form validation
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            if (!validateForm(this)) {
                e.preventDefault();
            }
        });
    });
}

// Mobile menu functionality
function toggleMobileMenu() {
    const navMenu = document.querySelector('.nav-menu');
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    
    if (navMenu.style.display === 'flex') {
        navMenu.style.display = 'none';
        mobileToggle.classList.remove('active');
    } else {
        navMenu.style.display = 'flex';
        navMenu.style.position = 'absolute';
        navMenu.style.top = '100%';
        navMenu.style.left = '0';
        navMenu.style.right = '0';
        navMenu.style.background = 'white';
        navMenu.style.flexDirection = 'column';
        navMenu.style.padding = '1rem';
        navMenu.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
        mobileToggle.classList.add('active');
    }
}

// Modal functionality
function showLoginModal() {
    document.getElementById('loginModal').style.display = 'block';
    // Allow scrolling when modal is open
}

function showSignupModal() {
    document.getElementById('signupModal').style.display = 'block';
    // Allow scrolling when modal is open
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
    // Scrolling enabled
}

function closeAllModals() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.style.display = 'none';
    });
    // Scrolling enabled
}

function switchToSignup() {
    closeModal('loginModal');
    showSignupModal();
}

function switchToLogin() {
    closeModal('signupModal');
    showLoginModal();
}

// Authentication functions
function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    // Simulate authentication (in real app, this would be an API call)
    const users = JSON.parse(localStorage.getItem('agrilinkUsers') || '[]');
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        currentUser = user;
        localStorage.setItem('agrilinkUser', JSON.stringify(user));
        updateUIForLoggedInUser();
        closeAllModals();
        showNotification('Login successful! Welcome back.', 'success');
        
        // Redirect based on user type
        if (user.type === 'farmer') {
            if (user.approved) {
                setTimeout(() => {
                    window.location.href = 'farmer-dashboard.html';
                }, 1500);
            } else {
                showNotification('Your account is pending approval. Please wait for admin verification.', 'info');
            }
        } else if (user.type === 'buyer') {
            setTimeout(() => {
                window.location.href = 'buyer-dashboard.html';
            }, 1500);
        } else if (user.type === 'admin') {
            setTimeout(() => {
                window.location.href = 'admin-dashboard.html';
            }, 1500);
        }
    } else {
        showNotification('Invalid email or password. Please try again.', 'error');
    }
}

function handleSignup(event) {
    event.preventDefault();
    
    const userType = document.querySelector('input[name="userType"]:checked').value;
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const phone = document.getElementById('signupPhone').value;
    const location = document.getElementById('signupLocation').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('signupConfirmPassword').value;
    
    // Get profile picture if farmer
    let profilePicture = null;
    if (userType === 'farmer') {
        const profilePictureInput = document.getElementById('profilePicture');
        const profileImage = document.querySelector('#profilePreview img');
        
        // Validate profile picture is provided for farmers
        if (!profilePictureInput || !profilePictureInput.files || !profilePictureInput.files[0]) {
            showNotification('Please upload a profile picture. It is required for farmer accounts.', 'error');
            // Highlight the profile picture field
            const profilePictureGroup = document.getElementById('profilePictureGroup');
            if (profilePictureGroup) {
                profilePictureGroup.style.border = '2px solid #ef4444';
                profilePictureGroup.style.borderRadius = '8px';
                profilePictureGroup.style.padding = '10px';
                setTimeout(() => {
                    profilePictureGroup.style.border = '';
                    profilePictureGroup.style.padding = '';
                }, 3000);
            }
            return;
        }
        
        if (profileImage) {
            profilePicture = profileImage.src;
        }
    }
    
    // Get additional farmer info
    let farmSize = null;
    let experience = null;
    if (userType === 'farmer') {
        farmSize = document.getElementById('farmSize').value;
        experience = document.getElementById('experience').value;
    }
    
    // Validation
    if (password !== confirmPassword) {
        showNotification('Passwords do not match. Please try again.', 'error');
        return;
    }
    
    // Check if user already exists
    const users = JSON.parse(localStorage.getItem('agrilinkUsers') || '[]');
    if (users.find(u => u.email === email)) {
        showNotification('An account with this email already exists.', 'error');
        return;
    }
    
    // Create new user
    const newUser = {
        id: Date.now().toString(),
        type: userType,
        name: name,
        email: email,
        phone: phone,
        location: location,
        password: password,
        approved: userType === 'buyer' ? true : false, // Buyers are auto-approved, farmers need admin approval
        profilePicture: profilePicture,
        farmSize: farmSize,
        experience: experience,
        createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    localStorage.setItem('agrilinkUsers', JSON.stringify(users));
    
    // Show appropriate success message based on user type
    if (userType === 'farmer') {
        showNotification('Account created successfully! Your farmer account is pending admin approval. You can login once approved.', 'success');
    } else if (userType === 'buyer') {
        showNotification('Account created successfully! You can now login and start shopping.', 'success');
    } else {
        showNotification('Account created successfully!', 'success');
    }
    
    // Clear form and switch to login
    document.getElementById('signupForm').reset();
    document.getElementById('profilePreview').innerHTML = '<span style="font-size: 3rem;">👤</span>';
    // Reset profile picture required attribute based on current selection
    const profilePictureInput = document.getElementById('profilePicture');
    if (profilePictureInput) {
        const userType = document.querySelector('input[name="userType"]:checked');
        if (userType && userType.value === 'farmer') {
            profilePictureInput.setAttribute('required', 'required');
        } else {
            profilePictureInput.removeAttribute('required');
        }
    }
    setTimeout(() => {
        switchToLogin();
    }, 2000);
}

function logout() {
    currentUser = null;
    localStorage.removeItem('agrilinkUser');
    updateUIForLoggedOutUser();
    showNotification('You have been logged out successfully.', 'success');
    window.location.href = 'index.html';
}

function updateUIForLoggedInUser() {
    const navActions = document.querySelector('.nav-actions');
    if (navActions && currentUser) {
        navActions.innerHTML = `
            <span class="welcome-message">Welcome, ${currentUser.name}</span>
            <button class="btn btn-outline" onclick="goToDashboard()">Dashboard</button>
            <button class="btn btn-primary" onclick="logout()">Logout</button>
        `;
    }
}

function updateUIForLoggedOutUser() {
    const navActions = document.querySelector('.nav-actions');
    if (navActions) {
        navActions.innerHTML = `
            <button class="btn btn-outline" onclick="showLoginModal()">Login</button>
            <button class="btn btn-primary" onclick="showSignupModal()">Sign Up</button>
        `;
    }
}

function goToDashboard() {
    if (currentUser.type === 'farmer') {
        window.location.href = 'farmer-dashboard.html';
    } else if (currentUser.type === 'buyer') {
        window.location.href = 'buyer-dashboard.html';
    } else if (currentUser.type === 'admin') {
        window.location.href = 'admin-dashboard.html';
    }
}

// Product management functions


function displayProducts(productsToShow = filteredProducts) {
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) return;
    
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const productsToDisplay = productsToShow.slice(startIndex, endIndex);
    
    if (productsToDisplay.length === 0) {
        productsGrid.innerHTML = `
            <div class="no-products">
                <h3>No products found</h3>
                <p>Try adjusting your search criteria or browse all products.</p>
            </div>
        `;
        return;
    }
    
    productsGrid.innerHTML = productsToDisplay.map(product => `
        <div class="product-card" onclick="viewProduct('${product.id}')">
            <div class="product-image">
                <img src="${product.images[0]}" alt="${product.title}" loading="lazy" onerror="this.src='https://via.placeholder.com/400x300/104862/ffffff?text=AgrilinkEthiopia'">
                ${product.organic ? '<span class="product-badge">Organic</span>' : ''}
                ${!product.available ? '<span class="product-badge" style="background: #e74c3c;">Out of Stock</span>' : ''}
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.title}</h3>
                <p class="product-category">${getCategoryDisplayName(product.category)}</p>
                <div class="product-price">ETB ${product.price}/kg</div>
                <p class="product-quantity">Available: ${product.quantity}</p>
                <p class="product-location"><img src="images/icon-location.png" alt="Location" style="width: 16px; height: 16px; vertical-align: middle; margin-right: 4px;"> ${getLocationDisplayName(product.location)}</p>
                <div class="product-farmer">
                    <div class="farmer-avatar">${product.farmer.name.charAt(0)}</div>
                    <div>
                        <div class="farmer-name">${product.farmer.name}</div>
                        <div class="farmer-rating">⭐ ${product.farmer.rating}</div>
                    </div>
                </div>
                <div class="product-actions">
                    <button class="btn btn-primary btn-small" onclick="contactFarmer('${product.id}', event)">Contact Farmer</button>
                    <button class="btn btn-outline btn-small" onclick="viewProduct('${product.id}', event)">View Details</button>
                </div>
            </div>
        </div>
    `).join('');
    
    // Lazy loading for images
    lazyLoadImages();
}

function viewProduct(productId, event) {
    if (event) {
        event.stopPropagation();
    }
    
    // Store the selected product in sessionStorage
    const product = products.find(p => p.id === productId);
    if (product) {
        sessionStorage.setItem('selectedProduct', JSON.stringify(product));
        window.location.href = 'product-detail.html';
    }
}

function contactFarmer(productId, event) {
    if (event) {
        event.stopPropagation();
    }
    
    const product = products.find(p => p.id === productId);
    if (product) {
        if (currentUser) {
            // Show contact modal or redirect to messaging
            showContactModal(product);
        } else {
            showNotification('Please login to contact farmers.', 'info');
            showLoginModal();
        }
    }
}

function showContactModal(product) {
    // Create contact modal dynamically
    const modalHtml = `
        <div id="contactModal" class="modal">
            <div class="modal-content">
                <span class="close" onclick="closeModal('contactModal')">&times;</span>
                <h2>Contact Farmer</h2>
                <div class="farmer-details">
                    <h3>${product.farmer.name}</h3>
                    <p><strong>Phone:</strong> ${product.farmer.phone}</p>
                    <p><strong>Product:</strong> ${product.title}</p>
                    <p><strong>Location:</strong> ${getLocationDisplayName(product.location)}</p>
                    <p><strong>Available Quantity:</strong> ${product.quantity}</p>
                    <p><strong>Price:</strong> ETB ${product.price}/kg</p>
                </div>
                <div class="contact-options">
                    <button class="btn btn-primary btn-full" onclick="makePhoneCall('${product.farmer.phone}')">
                        <img src="images/icon-phone.png" alt="Call" style="width: 20px; height: 20px; vertical-align: middle; margin-right: 8px; filter: brightness(0) invert(1);"> Call Now
                    </button>
                    <button class="btn btn-outline btn-full" onclick="sendWhatsApp('${product.farmer.phone}', '${product.title}')">
                        <img src="images/icon-whatsapp.png" alt="WhatsApp" style="width: 20px; height: 20px; vertical-align: middle; margin-right: 8px;"> Send WhatsApp
                    </button>
                    <button class="btn btn-outline btn-full" onclick="sendEmail('${product.farmer.email}', '${product.title}')">
                        <img src="images/icon-email.png" alt="Email" style="width: 20px; height: 20px; vertical-align: middle; margin-right: 8px;"> Send Email
                    </button>
                </div>
                <div class="mobile-money-section">
                    <h4>Payment Options</h4>
                    <p>This farmer accepts:</p>
                    <div class="payment-methods">
                        <span class="payment-method">TeleBirr</span>
                        <span class="payment-method">CBE Birr</span>
                        <span class="payment-method">Cash on Delivery</span>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Remove existing contact modal if any
    const existingModal = document.getElementById('contactModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Add new modal to body
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    document.getElementById('contactModal').style.display = 'block';
}

function makePhoneCall(phoneNumber) {
    window.location.href = `tel:${phoneNumber}`;
}

function sendWhatsApp(phoneNumber, productName) {
    const message = `Hi, I'm interested in your ${productName} listed on AgrilinkEthiopia. Is it still available?`;
    window.open(`https://wa.me/${phoneNumber.replace(/[^\d]/g, '')}?text=${encodeURIComponent(message)}`, '_blank');
}

function sendEmail(email, productName) {
    const subject = `Inquiry about ${productName} - AgrilinkEthiopia`;
    const body = `Hello,\n\nI'm interested in your ${productName} listed on AgrilinkEthiopia. Could you please provide more information about availability and pricing?\n\nThank you.`;
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

// Search and filter functions
function searchProducts() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    
    if (searchTerm === '') {
        filteredProducts = [...products];
    } else {
        filteredProducts = products.filter(product => 
            product.title.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm) ||
            product.category.toLowerCase().includes(searchTerm) ||
            product.farmer.name.toLowerCase().includes(searchTerm)
        );
    }
    
    currentPage = 1;
    displayProducts();
}

function filterByCategory(category) {
    filteredProducts = products.filter(product => product.category === category);
    currentPage = 1;
    displayProducts();
    
    // Scroll to products section
    document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
}

function filterByLocation() {
    const location = document.getElementById('locationFilter').value;
    
    if (location === '') {
        filteredProducts = [...products];
    } else {
        filteredProducts = products.filter(product => product.location === location);
    }
    
    currentPage = 1;
    displayProducts();
}

function sortProducts() {
    const sortBy = document.getElementById('sortFilter').value;
    
    switch(sortBy) {
        case 'price-low':
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
        case 'newest':
        default:
            filteredProducts.sort((a, b) => new Date(b.postedDate) - new Date(a.postedDate));
            break;
    }
    
    displayProducts();
}

function loadMoreProducts() {
    currentPage++;
    displayProducts();
}

// Utility functions
function getCategoryDisplayName(category) {
    const categoryNames = {
        'vegetables': 'Vegetables',
        'fruits': 'Fruits',
        'grains': 'Grains',
        'spices': 'Spices',
        'legumes': 'Legumes',
        'dairy': 'Dairy Products',
        'coffee': 'Coffee',
        'tubers': 'Tubers',
        'oilseeds': 'Oilseeds',
        'pulses': 'Pulses'
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

function scrollToProducts() {
    document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
}

function showNotification(message, type = 'info') {
    // Remove any existing notifications first
    const existingNotifications = document.querySelectorAll('.enhanced-notification');
    existingNotifications.forEach(n => n.remove());
    
    // Define colors and icons for each type
    const notificationConfig = {
        success: {
            bgColor: '#10b981',
            borderColor: '#059669',
            icon: '✓',
            iconBg: '#059669',
            textColor: '#ffffff'
        },
        error: {
            bgColor: '#ef4444',
            borderColor: '#dc2626',
            icon: '✕',
            iconBg: '#dc2626',
            textColor: '#ffffff'
        },
        info: {
            bgColor: '#3b82f6',
            borderColor: '#2563eb',
            icon: 'ℹ',
            iconBg: '#2563eb',
            textColor: '#ffffff'
        }
    };
    
    const config = notificationConfig[type] || notificationConfig.info;
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'enhanced-notification';
    notification.innerHTML = `
        <div class="notification-content">
            <div class="notification-icon" style="background: ${config.iconBg}">
                ${config.icon}
            </div>
            <div class="notification-message">
                <strong>${type === 'success' ? 'Success!' : type === 'error' ? 'Error!' : 'Info'}</strong>
                <p>${message}</p>
            </div>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        min-width: 350px;
        max-width: 450px;
        background: ${config.bgColor};
        border: 2px solid ${config.borderColor};
        border-radius: 12px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.05);
        animation: slideInRight 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        overflow: hidden;
    `;
    
    // Add to body
    document.body.appendChild(notification);
    
    // Auto-remove after 6 seconds (longer for better visibility)
    const autoRemove = setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.4s ease';
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 400);
    }, 6000);
    
    // Clear timeout if user manually closes
    notification.querySelector('.notification-close').addEventListener('click', () => {
        clearTimeout(autoRemove);
    });
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

function validateForm(form) {
    let isValid = true;
    const inputs = form.querySelectorAll('input[required], select[required]');
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            input.style.borderColor = '#e74c3c';
            isValid = false;
        } else {
            input.style.borderColor = '#e1e8ed';
        }
    });
    
    if (!isValid) {
        showNotification('Please fill in all required fields.', 'error');
    }
    
    return isValid;
}

function lazyLoadImages() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(120%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(120%);
            opacity: 0;
        }
    }
    
    .no-products {
        grid-column: 1 / -1;
        text-align: center;
        padding: 3rem;
        color: #666;
    }
    
    .welcome-message {
        display: flex;
        align-items: center;
        margin-right: 1rem;
        font-weight: 500;
        color: #666;
    }
    
    .farmer-details {
        background: #f8f9fa;
        padding: 1rem;
        border-radius: 8px;
        margin-bottom: 1rem;
    }
    
    .farmer-details h3 {
        color: #2c3e50;
        margin-bottom: 0.5rem;
    }
    
    .farmer-details p {
        margin-bottom: 0.5rem;
        color: #666;
    }
    
    .contact-options {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        margin-bottom: 1rem;
    }
    
    .mobile-money-section {
        background: #e8f5e8;
        padding: 1rem;
        border-radius: 8px;
        text-align: center;
    }
    
    .mobile-money-section h4 {
        color: #27ae60;
        margin-bottom: 0.5rem;
    }
    
    .payment-methods {
        display: flex;
        justify-content: center;
        gap: 0.5rem;
        flex-wrap: wrap;
        margin-top: 0.5rem;
    }
    
    .payment-method {
        background: white;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 0.9rem;
        border: 1px solid #27ae60;
    }
    
    .enhanced-notification {
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        padding: 18px 20px;
        gap: 15px;
        color: #ffffff;
    }
    
    .notification-icon {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
        font-weight: bold;
        flex-shrink: 0;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    }
    
    .notification-message {
        flex: 1;
        min-width: 0;
    }
    
    .notification-message strong {
        display: block;
        font-size: 16px;
        font-weight: 600;
        margin-bottom: 4px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }
    
    .notification-message p {
        margin: 0;
        font-size: 14px;
        line-height: 1.5;
        opacity: 0.95;
    }
    
    .notification-close {
        background: rgba(255, 255, 255, 0.2);
        border: none;
        color: #ffffff;
        width: 28px;
        height: 28px;
        border-radius: 50%;
        cursor: pointer;
        font-size: 20px;
        line-height: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        transition: all 0.2s ease;
        padding: 0;
    }
    
    .notification-close:hover {
        background: rgba(255, 255, 255, 0.3);
        transform: scale(1.1);
    }
    
    .notification-close:active {
        transform: scale(0.95);
    }
    
    @media (max-width: 768px) {
        .enhanced-notification {
            min-width: calc(100% - 40px) !important;
            max-width: calc(100% - 40px) !important;
            right: 20px !important;
            left: 20px !important;
        }
        
        .notification-content {
            padding: 16px;
            gap: 12px;
        }
        
        .notification-icon {
            width: 36px;
            height: 36px;
            font-size: 18px;
        }
        
        .notification-message strong {
            font-size: 15px;
        }
        
        .notification-message p {
            font-size: 13px;
        }
    }
`;
document.head.appendChild(style);