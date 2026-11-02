import { handleMockRequest } from './mockBackend.js';

const API_BASE = (import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL.replace(/\/$/, '')}/api`
  : '/api');

export function getAuthToken(): string | null {
  return localStorage.getItem('dod_token');
}

export function setAuthToken(token: string) {
  localStorage.setItem('dod_token', token);
}

export function clearAuthToken() {
  localStorage.removeItem('dod_token');
  localStorage.removeItem('dod_user');
}

async function request<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });

    // If endpoint is not found (static hosts like Netlify with no backend server), fallback to demo engine
    if (response.status === 404 || response.status === 502 || response.status === 503) {
      return await handleMockRequest<T>(endpoint, options);
    }

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.error || `Request failed with status ${response.status}`);
    }

    return data;
  } catch (err: any) {
    // If it's a fetch network error (e.g. backend offline or refused connection)
    if (
      err.name === 'TypeError' ||
      err.message?.includes('Failed to fetch') ||
      err.message?.includes('NetworkError') ||
      err.message?.includes('Load failed')
    ) {
      return await handleMockRequest<T>(endpoint, options);
    }

    // Otherwise, it was an explicit server validation error (e.g. 400 Bad Request) from a running backend
    throw err;
  }
}

export const api = {
  // Auth
  login: (credentials: any) => request('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  registerCustomer: (data: any) => request('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  registerDriver: (data: any) => request('/auth/register-driver', { method: 'POST', body: JSON.stringify(data) }),
  getMe: () => request('/auth/me'),
  logout: () => request('/auth/logout', { method: 'POST' }),

  // Vehicles
  getVehicles: () => request('/vehicles'),
  addVehicle: (data: any) => request('/vehicles', { method: 'POST', body: JSON.stringify(data) }),
  updateVehicle: (id: number, data: any) => request(`/vehicles/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteVehicle: (id: number) => request(`/vehicles/${id}`, { method: 'DELETE' }),

  // Drivers
  getAvailableDrivers: (serviceArea?: string) => 
    request(`/drivers/available${serviceArea ? `?serviceArea=${encodeURIComponent(serviceArea)}` : ''}`),
  getDriverProfile: (id: number) => request(`/drivers/${id}`),
  getDriverStatus: () => request('/drivers/me/status'),
  updateAvailability: (availability: 'ONLINE' | 'OFFLINE') => 
    request('/drivers/me/availability', { method: 'PATCH', body: JSON.stringify({ availability }) }),
  uploadDocument: (data: any) => request('/drivers/documents', { method: 'POST', body: JSON.stringify(data) }),
  getDriverEarnings: () => request('/drivers/me/earnings'),
  getIncomingRequests: () => request('/drivers/me/incoming-requests'),

  // Bookings
  calculateQuote: (data: any) => request('/bookings/quote', { method: 'POST', body: JSON.stringify(data) }),
  createBooking: (data: any) => request('/bookings', { method: 'POST', body: JSON.stringify(data) }),
  getBookings: () => request('/bookings'),
  getBookingDetails: (id: number) => request(`/bookings/${id}`),
  acceptBooking: (id: number) => request(`/bookings/${id}/accept`, { method: 'POST' }),
  declineBooking: (id: number) => request(`/bookings/${id}/decline`, { method: 'POST' }),
  updateBookingStatus: (id: number, nextStatus: string, reason?: string) =>
    request(`/bookings/${id}/status`, { method: 'POST', body: JSON.stringify({ nextStatus, reason }) }),
  cancelBooking: (id: number, reason: string) =>
    request(`/bookings/${id}/cancel`, { method: 'POST', body: JSON.stringify({ reason }) }),
  submitReview: (id: number, rating: number, comment: string) =>
    request(`/bookings/${id}/reviews`, { method: 'POST', body: JSON.stringify({ rating, comment }) }),

  // Admin
  getAdminSummary: () => request('/admin/summary'),
  getAdminDrivers: (status?: string) => request(`/admin/drivers${status ? `?status=${status}` : ''}`),
  reviewDriverDecision: (id: number, decision: string, reason: string) =>
    request(`/admin/drivers/${id}/decision`, { method: 'PATCH', body: JSON.stringify({ decision, reason }) }),
  getAdminUsers: (role?: string) => request(`/admin/users${role ? `?role=${role}` : ''}`),
  updateUserStatus: (id: number, accountStatus: string, reason: string) =>
    request(`/admin/users/${id}/status`, { method: 'PATCH', body: JSON.stringify({ accountStatus, reason }) }),
  getPricingRules: () => request('/admin/pricing'),
  updatePricingRule: (id: number, data: any) => request(`/admin/pricing/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  getAuditLogs: () => request('/admin/audit-logs'),

  // Support
  createSupportCase: (data: any) => request('/support', { method: 'POST', body: JSON.stringify(data) }),
  getSupportCases: () => request('/support'),
  resolveSupportCase: (id: number, status: string, resolutionNotes: string) =>
    request(`/support/${id}/resolve`, { method: 'PATCH', body: JSON.stringify({ status, resolutionNotes }) }),

  // Payments
  createPaymentOrder: (bookingId: number) => request('/payments/order', { method: 'POST', body: JSON.stringify({ bookingId }) }),
  verifyPayment: (data: any) => request('/payments/verify', { method: 'POST', body: JSON.stringify(data) }),
};
