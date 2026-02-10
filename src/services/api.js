import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add token from localStorage on startup
const token = localStorage.getItem('token');
if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            delete api.defaults.headers.common['Authorization'];

            // Redirect to login if not already there
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;

// Auth API
export const authAPI = {
    getProfile: () => api.get('/auth/profile'),
    updateProfile: (data) => api.put('/auth/profile', data),
    uploadAvatar: (formData) => api.post('/upload/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    })
};

// Product API
export const productAPI = {
    getAll: (params) => api.get('/products', { params }),
    getById: (id) => api.get(`/products/${id}`),
    getFeatured: () => api.get('/products/featured'),
    getCategories: () => api.get('/products/categories'),
    getStats: () => api.get('/products/stats'),
    create: (data) => api.post('/products', data),
    update: (id, data) => api.put(`/products/${id}`, data),
    delete: (id) => api.delete(`/products/${id}`)
};

// Order API
export const orderAPI = {
    create: (data) => api.post('/orders', data),
    getAll: (params) => api.get('/orders', { params }),
    getById: (id) => api.get(`/orders/${id}`),
    updateStatus: (id, data) => api.put(`/orders/${id}/status`, data),
    cancel: (id, reason) => api.post(`/orders/${id}/cancel`, { reason })
};

// Payment API
export const paymentAPI = {
    createOrder: (orderId) => api.post('/payments/create-order', { orderId }),
    verify: (data) => api.post('/payments/verify', data)
};

// Review API
export const reviewAPI = {
    getByProduct: (productId, params) => api.get(`/reviews/product/${productId}`, { params }),
    getByDelivery: (partnerId, params) => api.get(`/reviews/delivery/${partnerId}`, { params }),
    create: (data) => api.post('/reviews', data),
    update: (id, data) => api.put(`/reviews/${id}`, data),
    delete: (id) => api.delete(`/reviews/${id}`)
};

// Analytics API (Admin)
export const analyticsAPI = {
    getDashboard: () => api.get('/analytics/dashboard'),
    getUsers: () => api.get('/analytics/users'),
    getSales: (params) => api.get('/analytics/sales', { params }),
    getRevenue: () => api.get('/analytics/revenue'),
    getInventory: () => api.get('/analytics/inventory'),
    getDelivery: () => api.get('/analytics/delivery')
};

// Admin API
export const adminAPI = {
    getUsers: (params) => api.get('/admin/users', { params }),
    getUser: (id) => api.get(`/admin/users/${id}`),
    createUser: (data) => api.post('/admin/users', data),
    updateUser: (id, data) => api.put(`/admin/users/${id}`, data),
    deleteUser: (id) => api.delete(`/admin/users/${id}`),
    getOrders: (params) => api.get('/admin/orders', { params }),
    getDeliveryPartners: () => api.get('/admin/delivery-partners'),
    createProduct: (formData) => api.post('/admin/products', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    updateProduct: (id, formData) => api.put(`/admin/products/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    deleteProduct: (id) => api.delete(`/admin/products/${id}`)
};

// Inventory API
export const inventoryAPI = {
    getAll: (params) => api.get('/inventory', { params }),
    getLowStock: () => api.get('/inventory/low-stock'),
    getAnalytics: () => api.get('/inventory/analytics'),
    addStock: (data) => api.post('/inventory/add-stock', data),
    update: (productId, data) => api.put(`/inventory/${productId}`, data),
    removeStock: (productId, data) => api.post(`/inventory/${productId}/remove-stock`, data)
};

// Delivery API
export const deliveryAPI = {
    getAssigned: (params) => api.get('/delivery/assigned', { params }),
    getById: (id) => api.get(`/delivery/${id}`),
    updateStatus: (id, data) => api.put(`/delivery/${id}/status`, data),
    confirm: (id, data) => api.post(`/delivery/${id}/confirm`, data),
    assign: (data) => api.post('/delivery/assign', data),
    getStats: () => api.get('/delivery/stats')
};
