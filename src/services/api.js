// This file is our communication layer between React and our Express API
// Think of it as a translator - React speaks JavaScript, API speaks HTTP
// Axios handles all the HTTP requests for us

import axios from 'axios';

// Base URL of our API
// All requests will start with this URL
const BASE_URL = 'http://localhost:5000/api';

// Create an axios instance with default settings
// Think of it like a configured fetch client
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ── REQUEST INTERCEPTOR ───────────────────────────────────────
// This runs before EVERY request we send
// It automatically adds the JWT token to every request
// So we don't have to manually add it every time!
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem('token');

    // If token exists add it to the Authorization header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ── RESPONSE INTERCEPTOR ──────────────────────────────────────
// This runs after EVERY response we receive
// If we get a 401 (unauthorized) it means token expired
// We automatically log the user out and redirect to login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - log out
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ── AUTH ENDPOINTS ────────────────────────────────────────────
  export const authAPI = {
    register:   (data) => api.post('/auth/register', data),
    login:      (data) => api.post('/auth/login', data),
    verifyOTP:  (data) => api.post('/auth/verify-otp', data),
    getMe:      () => api.get('/auth/me'),
    googleAuth: () => window.location.href = 'http://localhost:5000/api/auth/google',
  };

// ── LOAN ENDPOINTS ────────────────────────────────────────────
export const loanAPI = {
  // Apply for a loan
  apply: (data) => api.post('/loans/apply', data),

  // Get all loans (admin)
  getAll: () => api.get('/loans'),

  // Get loan by ID
  getById: (id) => api.get(`/loans/${id}`),

  // Get loans by national ID
  getByNationalId: (nationalId) => api.get(`/loans/applicant/${nationalId}`),
};

// ── USER ENDPOINTS ────────────────────────────────────────────
export const userAPI = {
  // Get my profile
  getMyProfile: () => api.get('/users/me/profile'),

  // Update my profile
  updateMyProfile: (data) => api.put('/users/me/profile', data),

  // Get all users (admin)
  getAll: () => api.get('/users'),

  // Get user by ID (admin)
  getById: (id) => api.get(`/users/${id}`),

  // Update user (admin)
  update: (id, data) => api.put(`/users/${id}`, data),
};

// ── DASHBOARD ENDPOINTS ───────────────────────────────────────
export const dashboardAPI = {
  // Get admin dashboard data
  getAdminDashboard: () => api.get('/dashboard/admin'),

  // Get applicant dashboard data
  getApplicantDashboard: () => api.get('/dashboard/applicant'),
};

// ── REPAYMENT ENDPOINTS ───────────────────────────────────────
export const repaymentAPI = {
  // Get my repayments
  getMyRepayments: () => api.get('/repayments/me'),

  // Get repayments by loan ID
  getByLoanId: (loanId) => api.get(`/repayments/loan/${loanId}`),

  // Generate repayment schedule
  generate: (loanId) => api.post(`/repayments/generate/${loanId}`),

  // Initiate payment via Paychangu
  initiatePayment: (repaymentId) => api.post('/repayments/initiate', { repaymentId }),

  // Get all repayments (admin)
  getAll: () => api.get('/repayments'),
};



export default api;