// Agrilink Ethiopia - API Configuration
// Centralized API configuration and helper functions

const API_BASE_URL = 'http://localhost:3000/api';

// Get auth token from localStorage
function getAuthToken() {
    return localStorage.getItem('agrilinkToken');
}

// API request helper with authentication
async function apiRequest(endpoint, options = {}) {
    const token = getAuthToken();
    
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
        ...options,
        headers
    };

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Request failed');
        }

        return data;
    } catch (error) {
        console.error('API Request Error:', error);
        throw error;
    }
}

// API endpoints
const API = {
    // Authentication
    auth: {
        register: (userData) => apiRequest('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData)
        }),
        login: (credentials) => apiRequest('/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials)
        }),
        getProfile: () => apiRequest('/auth/profile'),
        updateProfile: (profileData) => apiRequest('/auth/profile', {
            method: 'PUT',
            body: JSON.stringify(profileData)
        }),
        verify: () => apiRequest('/auth/verify')
    },

    // Products
    products: {
        getAll: (filters = {}) => {
            const params = new URLSearchParams(filters);
            return apiRequest(`/products?${params}`);
        },
        getById: (id) => apiRequest(`/products/${id}`),
        create: (productData) => apiRequest('/products', {
            method: 'POST',
            body: JSON.stringify(productData)
        }),
        update: (id, productData) => apiRequest(`/products/${id}`, {
            method: 'PUT',
            body: JSON.stringify(productData)
        }),
        delete: (id) => apiRequest(`/products/${id}`, {
            method: 'DELETE'
        }),
        getMyProducts: () => apiRequest('/products/farmer/my-products')
    },

    // Orders
    orders: {
        create: (orderData) => apiRequest('/orders', {
            method: 'POST',
            body: JSON.stringify(orderData)
        }),
        getMyOrders: () => apiRequest('/orders/my-orders'),
        getFarmerOrders: () => apiRequest('/orders/farmer/orders'),
        getById: (id) => apiRequest(`/orders/${id}`),
        updateStatus: (id, status) => apiRequest(`/orders/${id}/status`, {
            method: 'PATCH',
            body: JSON.stringify({ status })
        }),
        cancel: (id) => apiRequest(`/orders/${id}/cancel`, {
            method: 'POST'
        })
    },

    // Delivery
    delivery: {
        getMyDeliveries: () => apiRequest('/delivery/my-deliveries'),
        updateAvailability: (status) => apiRequest('/delivery/availability', {
            method: 'PATCH',
            body: JSON.stringify({ status })
        }),
        updateDeliveryStatus: (orderId, status) => apiRequest(`/delivery/delivery/${orderId}/status`, {
            method: 'PATCH',
            body: JSON.stringify({ status })
        }),
        getStats: () => apiRequest('/delivery/stats'),
        acceptAssignment: (assignmentId) => apiRequest(`/delivery/assignment/${assignmentId}/accept`, {
            method: 'POST'
        }),
        rejectAssignment: (assignmentId) => apiRequest(`/delivery/assignment/${assignmentId}/reject`, {
            method: 'POST'
        })
    },

    // Admin
    admin: {
        getUsers: (type) => apiRequest(`/admin/users${type ? `?type=${type}` : ''}`),
        getProducts: (status) => apiRequest(`/admin/products${status ? `?status=${status}` : ''}`),
        getOrders: () => apiRequest('/admin/orders'),
        approveUser: (id) => apiRequest(`/admin/users/${id}/approve`, {
            method: 'PATCH'
        }),
        suspendUser: (id) => apiRequest(`/admin/users/${id}/suspend`, {
            method: 'PATCH'
        }),
        deleteUser: (id) => apiRequest(`/admin/users/${id}`, {
            method: 'DELETE'
        }),
        approveProduct: (id) => apiRequest(`/admin/products/${id}/approve`, {
            method: 'PATCH'
        }),
        rejectProduct: (id, reason) => apiRequest(`/admin/products/${id}/reject`, {
            method: 'PATCH',
            body: JSON.stringify({ reason })
        }),
        suspendProduct: (id) => apiRequest(`/admin/products/${id}/suspend`, {
            method: 'PATCH'
        }),
        deleteProduct: (id) => apiRequest(`/admin/products/${id}`, {
            method: 'DELETE'
        }),
        getStats: () => apiRequest('/admin/stats'),
        getSettings: () => apiRequest('/admin/settings'),
        updateSetting: (key, value) => apiRequest(`/admin/settings/${key}`, {
            method: 'PATCH',
            body: JSON.stringify({ value })
        })
    }
};

// Service fee percentage (will be fetched from backend, this is fallback)
let SERVICE_FEE_PERCENTAGE = 10.00;

// Initialize - fetch service fee percentage
async function initializeAPI() {
    try {
        const settings = await API.admin.getSettings();
        if (settings.success && settings.settings.service_fee_percentage) {
            SERVICE_FEE_PERCENTAGE = parseFloat(settings.settings.service_fee_percentage);
        }
    } catch (error) {
        // Use default if not admin or error fetching
        console.log('Using default service fee percentage:', SERVICE_FEE_PERCENTAGE);
    }
}

// Calculate display price with service fee
function calculateDisplayPrice(basePrice) {
    const serviceFee = (basePrice * SERVICE_FEE_PERCENTAGE) / 100;
    return {
        basePrice: basePrice,
        serviceFee: serviceFee,
        displayPrice: basePrice + serviceFee,
        serviceFeePercentage: SERVICE_FEE_PERCENTAGE
    };
}
