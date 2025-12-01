// AgrilinkEthiopia - Product Detail Page JavaScript

let currentProduct = null;
let currentUser = null;
let allProducts = [];
let similarProducts = [];

// Initialize the product detail page
document.addEventListener('DOMContentLoaded', function() {
    initializeProductDetail();
});

function initializeProductDetail() {
    // Check if user is logged in
    const savedUser = localStorage.getItem('agrilinkUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        updateUIForLoggedInUser();
    }
    
    // Load product from sessionStorage
    const savedProduct = sessionStorage.getItem('selectedProduct');
    if (savedProduct) {
        currentProduct = JSON.parse(savedProduct);
        loadProductDetails();
        loadSimilarProducts();
    } else {
        // Redirect to home if no product selected
        window.location.href = 'index.html';
    }
    
    // Setup event listeners
    setupEventListeners();
}

function setupEventListeners() {
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

function loadProductDetails() {
    if (!currentProduct) return;
    
    // Update breadcrumb
    document.getElementById('breadcrumbCategory').textContent = getCategoryDisplayName(currentProduct.category);
    document.getElementById('breadcrumbProduct').textContent = currentProduct.title;
    
    // Update product information
    document.getElementById('productTitle').textContent = currentProduct.title;
    document.getElementById('productPrice').textContent = `ETB ${currentProduct.price}/kg`;
    document.getElementById('productQuantity').textContent = `Available: ${currentProduct.quantity}`;
    document.getElementById('productLocation').textContent = getLocationDisplayName(currentProduct.location);
    document.getElementById('productDescription').textContent = currentProduct.description;
    
    // Update category badge
    const categoryBadge = document.getElementById('categoryBadge');
    categoryBadge.innerHTML = `
        <span>${getCategoryIcon(currentProduct.category)}</span>
        <span>${getCategoryDisplayName(currentProduct.category)}</span>
    `;
    
    // Show/hide organic and certified badges
    if (currentProduct.organic) {
        document.getElementById('organicBadge').style.display = 'flex';
    }
    if (currentProduct.certified) {
        document.getElementById('certifiedBadge').style.display = 'flex';
    }
    
    // Update status badge
    const statusBadge = document.getElementById('statusBadge');
    if (currentProduct.available) {
        statusBadge.innerHTML = `
            <span>✓</span>
            <span>Available</span>
        `;
        statusBadge.style.background = '#d4edda';
        statusBadge.style.color = '#155724';
    } else {
        statusBadge.innerHTML = `
            <span>✗</span>
            <span>Out of Stock</span>
        `;
        statusBadge.style.background = '#f8d7da';
        statusBadge.style.color = '#721c24';
    }
    
    // Update farmer information
    document.getElementById('farmerName').textContent = currentProduct.farmer.name;
    document.getElementById('farmerRating').textContent = currentProduct.farmer.rating;
    document.getElementById('farmerAvatar').textContent = currentProduct.farmer.name.charAt(0);
    
    // Calculate farmer statistics
    const farmerProducts = allProducts.filter(p => p.farmer.id === currentProduct.farmer.id);
    document.getElementById('farmerProducts').textContent = farmerProducts.length;
    
    // Simulate order count and years active (in real app, this would come from database)
    document.getElementById('farmerOrders').textContent = Math.floor(Math.random() * 50) + 10;
    document.getElementById('farmerYears').textContent = Math.floor(Math.random() * 10) + 1;
    
    // Update product specifications
    document.getElementById('specCategory').textContent = getCategoryDisplayName(currentProduct.category);
    document.getElementById('specQuantity').textContent = currentProduct.quantity;
    document.getElementById('specPrice').textContent = `ETB ${currentProduct.price}/kg`;
    document.getElementById('specLocation').textContent = getLocationDisplayName(currentProduct.location);
    document.getElementById('specPostedDate').textContent = formatDate(currentProduct.postedDate);
    document.getElementById('specHarvestDate').textContent = currentProduct.harvestDate ? formatDate(currentProduct.harvestDate) : 'Not specified';
    
    // Load product images
    loadProductImages();
}

function loadProductImages() {
    if (!currentProduct || !currentProduct.images) return;
    
    // Set main image
    const mainImage = document.getElementById('mainProductImage');
    mainImage.src = currentProduct.images[0];
    
    // Load thumbnails
    const thumbnailGallery = document.getElementById('thumbnailGallery');
    thumbnailGallery.innerHTML = '';
    
    currentProduct.images.forEach((image, index) => {
        const thumbnail = document.createElement('div');
        thumbnail.className = `thumbnail ${index === 0 ? 'active' : ''}`;
        thumbnail.innerHTML = `<img src="${image}" alt="Product image ${index + 1}">`;
        thumbnail.onclick = () => selectImage(image, thumbnail);
        thumbnailGallery.appendChild(thumbnail);
    });
}

function selectImage(imageSrc, thumbnailElement) {
    // Update main image
    document.getElementById('mainProductImage').src = imageSrc;
    
    // Update active thumbnail
    document.querySelectorAll('.thumbnail').forEach(thumb => {
        thumb.classList.remove('active');
    });
    thumbnailElement.classList.add('active');
}

function loadSimilarProducts() {
    // Load all products
    allProducts = JSON.parse(localStorage.getItem('agrilinkProducts') || '[]');
    
    // Find similar products (same category, different product)
    similarProducts = allProducts.filter(product => 
        product.category === currentProduct.category && 
        product.id !== currentProduct.id &&
        product.available
    ).slice(0, 4);
    
    // Display similar products
    const similarProductsGrid = document.getElementById('similarProductsGrid');
    if (similarProducts.length === 0) {
        similarProductsGrid.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; color: #666;">No similar products found.</p>';
        return;
    }
    
    similarProductsGrid.innerHTML = similarProducts.map(product => `
        <div class="similar-product-card" onclick="viewProduct('${product.id}')">
            <div class="similar-product-image">
                <img src="${product.images[0]}" alt="${product.title}">
            </div>
            <div class="similar-product-info">
                <div class="similar-product-title">${product.title}</div>
                <div class="similar-product-price">ETB ${product.price}/kg</div>
                <div class="similar-product-farmer">by ${product.farmer.name}</div>
            </div>
        </div>
    `).join('');
}

function viewProduct(productId) {
    const product = allProducts.find(p => p.id === productId);
    if (product) {
        sessionStorage.setItem('selectedProduct', JSON.stringify(product));
        window.location.reload();
    }
}

// Contact Functions
function contactFarmer() {
    if (!currentUser) {
        showNotification('Please login to contact farmers.', 'info');
        showLoginModal();
        return;
    }
    
    if (!currentProduct.available) {
        showNotification('This product is currently out of stock.', 'warning');
        return;
    }
    
    // Show contact modal
    showContactModal();
}

function showContactModal() {
    const modalHtml = `
        <div id="contactModal" class="modal">
            <div class="modal-content">
                <span class="close" onclick="closeModal('contactModal')">&times;</span>
                <h2>Contact Farmer</h2>
                <div class="farmer-details">
                    <h3>${currentProduct.farmer.name}</h3>
                    <p><strong>Phone:</strong> ${currentProduct.farmer.phone}</p>
                    <p><strong>Product:</strong> ${currentProduct.title}</p>
                    <p><strong>Location:</strong> ${getLocationDisplayName(currentProduct.location)}</p>
                    <p><strong>Available Quantity:</strong> ${currentProduct.quantity}</p>
                    <p><strong>Price:</strong> ETB ${currentProduct.price}/kg</p>
                </div>
                <div class="contact-options">
                    <button class="btn btn-primary btn-full" onclick="makePhoneCall()">
                        📞 Call Now
                    </button>
                    <button class="btn btn-outline btn-full" onclick="sendWhatsApp()">
                        💬 Send WhatsApp
                    </button>
                    <button class="btn btn-outline btn-full" onclick="sendEmail()">
                        ✉️ Send Email
                    </button>
                </div>
                <div class="mobile-money-section">
                    <h4>Payment Options</h4>
                    <p>This farmer accepts:</p>
                    <div class="payment-methods">
                        <span class="payment-method">📱 TeleBirr</span>
                        <span class="payment-method">📱 CBE Birr</span>
                        <span class="payment-method">💵 Cash on Delivery</span>
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

function makePhoneCall() {
    window.location.href = `tel:${currentProduct.farmer.phone}`;
}

function sendWhatsApp() {
    const message = `Hi, I'm interested in your ${currentProduct.title} listed on AgrilinkEthiopia. Is it still available?`;
    window.open(`https://wa.me/${currentProduct.farmer.phone.replace(/[^\d]/g, '')}?text=${encodeURIComponent(message)}`, '_blank');
}

function sendEmail() {
    const subject = `Inquiry about ${currentProduct.title} - AgrilinkEthiopia`;
    const body = `Hello ${currentProduct.farmer.name},\n\nI'm interested in your ${currentProduct.title} listed on AgrilinkEthiopia. Could you please provide more information about availability and pricing?\n\nProduct Details:\n- Title: ${currentProduct.title}\n- Price: ETB ${currentProduct.price}/kg\n- Available Quantity: ${currentProduct.quantity}\n- Location: ${getLocationDisplayName(currentProduct.location)}\n\nThank you.`;
    window.location.href = `mailto:${currentProduct.farmer.email || 'info@example.com'}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

function scheduleVisit() {
    if (!currentUser) {
        showNotification('Please login to schedule a farm visit.', 'info');
        showLoginModal();
        return;
    }
    
    // Create schedule visit modal
    const modalHtml = `
        <div id="scheduleModal" class="modal">
            <div class="modal-content">
                <span class="close" onclick="closeModal('scheduleModal')">&times;</span>
                <h2>Schedule Farm Visit</h2>
                <form onsubmit="handleScheduleVisit(event)">
                    <div class="form-group">
                        <label for="visitDate">Preferred Date</label>
                        <input type="date" id="visitDate" required>
                    </div>
                    <div class="form-group">
                        <label for="visitTime">Preferred Time</label>
                        <select id="visitTime" required>
                            <option value="">Select time</option>
                            <option value="9:00 AM">9:00 AM</option>
                            <option value="10:00 AM">10:00 AM</option>
                            <option value="11:00 AM">11:00 AM</option>
                            <option value="2:00 PM">2:00 PM</option>
                            <option value="3:00 PM">3:00 PM</option>
                            <option value="4:00 PM">4:00 PM</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="visitPurpose">Purpose of Visit</label>
                        <select id="visitPurpose" required>
                            <option value="">Select purpose</option>
                            <option value="product-inspection">Product Inspection</option>
                            <option value="quantity-negotiation">Quantity Negotiation</option>
                            <option value="quality-assessment">Quality Assessment</option>
                            <option value="partnership-discussion">Partnership Discussion</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="visitMessage">Additional Message</label>
                        <textarea id="visitMessage" placeholder="Any specific requirements or questions..."></textarea>
                    </div>
                    <button type="submit" class="btn btn-primary btn-full">Schedule Visit</button>
                </form>
            </div>
        </div>
    `;
    
    // Remove existing modal if any
    const existingModal = document.getElementById('scheduleModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Add new modal to body
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    document.getElementById('scheduleModal').style.display = 'block';
}

function handleScheduleVisit(event) {
    event.preventDefault();
    
    const visitData = {
        productId: currentProduct.id,
        farmerId: currentProduct.farmer.id,
        buyerId: currentUser.id,
        buyerName: currentUser.name,
        date: document.getElementById('visitDate').value,
        time: document.getElementById('visitTime').value,
        purpose: document.getElementById('visitPurpose').value,
        message: document.getElementById('visitMessage').value,
        status: 'pending',
        createdAt: new Date().toISOString()
    };
    
    // Save visit request (in real app, this would be sent to backend)
    const visits = JSON.parse(localStorage.getItem('agrilinkVisits') || '[]');
    visits.push(visitData);
    localStorage.setItem('agrilinkVisits', JSON.stringify(visits));
    
    showNotification('Farm visit scheduled successfully! The farmer will contact you to confirm.', 'success');
    closeModal('scheduleModal');
}

function makeOffer() {
    if (!currentUser) {
        showNotification('Please login to make an offer.', 'info');
        showLoginModal();
        return;
    }
    
    // Create offer modal
    const modalHtml = `
        <div id="offerModal" class="modal">
            <div class="modal-content">
                <span class="close" onclick="closeModal('offerModal')">&times;</span>
                <h2>Make an Offer</h2>
                <form onsubmit="handleMakeOffer(event)">
                    <div class="form-group">
                        <label for="offerQuantity">Quantity (kg)</label>
                        <input type="number" id="offerQuantity" min="1" required>
                    </div>
                    <div class="form-group">
                        <label for="offerPrice">Offer Price per kg (ETB)</label>
                        <input type="number" id="offerPrice" min="0" step="0.01" placeholder="${currentProduct.price}" required>
                    </div>
                    <div class="form-group">
                        <label for="offerDelivery">Delivery Location</label>
                        <select id="offerDelivery" required>
                            <option value="">Select delivery location</option>
                            <option value="farm-pickup">Farm Pickup</option>
                            <option value="buyer-location">Deliver to My Location</option>
                            <option value="agreed-point">Agreed Meeting Point</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="offerMessage">Message to Farmer</label>
                        <textarea id="offerMessage" placeholder="Describe your requirements and negotiate terms..."></textarea>
                    </div>
                    <div class="form-group">
                        <label><strong>Total Offer Amount:</strong> ETB <span id="totalOfferAmount">0</span></label>
                    </div>
                    <button type="submit" class="btn btn-primary btn-full">Submit Offer</button>
                </form>
            </div>
        </div>
    `;
    
    // Remove existing modal if any
    const existingModal = document.getElementById('offerModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Add new modal to body
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    document.getElementById('offerModal').style.display = 'block';
    
    // Add event listeners for offer calculation
    const quantityInput = document.getElementById('offerQuantity');
    const priceInput = document.getElementById('offerPrice');
    const totalAmount = document.getElementById('totalOfferAmount');
    
    function calculateTotal() {
        const quantity = parseFloat(quantityInput.value) || 0;
        const price = parseFloat(priceInput.value) || 0;
        totalAmount.textContent = (quantity * price).toLocaleString();
    }
    
    quantityInput.addEventListener('input', calculateTotal);
    priceInput.addEventListener('input', calculateTotal);
}

function handleMakeOffer(event) {
    event.preventDefault();
    
    const offerData = {
        productId: currentProduct.id,
        farmerId: currentProduct.farmer.id,
        buyerId: currentUser.id,
        buyerName: currentUser.name,
        quantity: document.getElementById('offerQuantity').value,
        pricePerKg: document.getElementById('offerPrice').value,
        totalPrice: parseFloat(document.getElementById('offerQuantity').value) * parseFloat(document.getElementById('offerPrice').value),
        delivery: document.getElementById('offerDelivery').value,
        message: document.getElementById('offerMessage').value,
        status: 'pending',
        createdAt: new Date().toISOString()
    };
    
    // Save offer (in real app, this would be sent to backend)
    const offers = JSON.parse(localStorage.getItem('agrilinkOffers') || '[]');
    offers.push(offerData);
    localStorage.setItem('agrilinkOffers', JSON.stringify(offers));
    
    showNotification('Offer submitted successfully! The farmer will review your offer and respond.', 'success');
    closeModal('offerModal');
}

// Authentication Functions
function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    // Simulate authentication
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
    
    if (password !== confirmPassword) {
        showNotification('Passwords do not match. Please try again.', 'error');
        return;
    }
    
    const users = JSON.parse(localStorage.getItem('agrilinkUsers') || '[]');
    if (users.find(u => u.email === email)) {
        showNotification('An account with this email already exists.', 'error');
        return;
    }
    
    const newUser = {
        id: Date.now().toString(),
        type: userType,
        name: name,
        email: email,
        phone: phone,
        location: location,
        password: password,
        approved: userType === 'buyer' ? true : false,
        createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    localStorage.setItem('agrilinkUsers', JSON.stringify(users));
    
    showNotification('Account created successfully! Please login to continue.', 'success');
    document.getElementById('signupForm').reset();
    setTimeout(() => {
        switchToLogin();
    }, 2000);
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

function goToDashboard() {
    if (currentUser.type === 'farmer') {
        window.location.href = 'farmer-dashboard.html';
    } else if (currentUser.type === 'buyer') {
        window.location.href = 'buyer-dashboard.html';
    } else if (currentUser.type === 'admin') {
        window.location.href = 'admin-dashboard.html';
    }
}

function logout() {
    currentUser = null;
    localStorage.removeItem('agrilinkUser');
    updateUIForLoggedOutUser();
    showNotification('You have been logged out successfully.', 'success');
    window.location.href = 'index.html';
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

// Modal Functions
function showLoginModal() {
    document.getElementById('loginModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function showSignupModal() {
    document.getElementById('signupModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
    document.body.style.overflow = 'auto';
}

function closeAllModals() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.style.display = 'none';
    });
    document.body.style.overflow = 'auto';
}

function switchToSignup() {
    closeModal('loginModal');
    showSignupModal();
}

function switchToLogin() {
    closeModal('signupModal');
    showLoginModal();
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

function getCategoryIcon(category) {
    const categoryIcons = {
        'vegetables': '🥬',
        'fruits': '🍎',
        'grains': '🌾',
        'spices': '🌶️',
        'legumes': '🫘',
        'dairy': '🥛'
    };
    return categoryIcons[category] || '🌾';
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

// Add CSS for contact modal
const contactModalCSS = `
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
`;

const style = document.createElement('style');
style.textContent = contactModalCSS;
document.head.appendChild(style);