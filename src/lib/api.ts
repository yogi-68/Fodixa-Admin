import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL as string;

if (!API_URL) {
  throw new Error('NEXT_PUBLIC_API_URL is not defined in environment variables');
}

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Admin API
export const adminAPI = {
  // Auth
  login: (credentials: { email: string; password: string }) =>
    api.post('/admin/login', credentials),
  
  // Dashboard stats
  getStats: () => api.get('/admin/stats'),
  
  // Restaurants
  getRestaurants: (params?: any) => api.get('/admin/restaurants', { params }),
  getRestaurant: (id: string) => api.get(`/admin/restaurants/${id}`),
  approveRestaurant: (id: string) => api.post(`/admin/restaurants/${id}/approve`),
  rejectRestaurant: (id: string, reason: string) => 
    api.post(`/admin/restaurants/${id}/reject`, { reason }),
  toggleRestaurantStatus: (id: string) => 
    api.post(`/admin/restaurants/${id}/toggle-status`),
  
  // Riders
  getRiders: (params?: any) => api.get('/admin/riders', { params }),
  getRider: (id: string) => api.get(`/admin/riders/${id}`),
  approveRider: (id: string) => api.post(`/admin/riders/${id}/approve`),
  rejectRider: (id: string, reason: string) => 
    api.post(`/admin/riders/${id}/reject`, { reason }),
  toggleRiderStatus: (id: string) => 
    api.post(`/admin/riders/${id}/toggle-status`),
  
  // Orders
  getOrders: (params?: any) => api.get('/admin/orders', { params }),
  getOrder: (id: string) => api.get(`/admin/orders/${id}`),
  cancelOrder: (id: string, reason: string) => 
    api.post(`/admin/orders/${id}/cancel`, { reason }),
  refundOrder: (id: string, amount: number) => 
    api.post(`/admin/orders/${id}/refund`, { amount }),
  
  // Users
  getUsers: (params?: any) => api.get('/admin/users', { params }),
  getUser: (id: string) => api.get(`/admin/users/${id}`),
  banUser: (id: string, reason: string) => 
    api.post(`/admin/users/${id}/ban`, { reason }),
  unbanUser: (id: string) => api.post(`/admin/users/${id}/unban`),
  
  // Analytics
  getAnalytics: (params?: { startDate?: string; endDate?: string }) => 
    api.get('/admin/analytics', { params }),
  
  // Audit logs
  getAuditLogs: (params?: any) => api.get('/admin/audit-logs', { params }),
};

export default api;
