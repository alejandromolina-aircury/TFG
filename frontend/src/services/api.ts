// frontend/src/services/api.ts

import axios from 'axios';
import type {
  ReservationPayload,
  ReservationConfirmation,
  DashboardData,
  Booking,
  BookingStatus,
  TimeSlot,
} from '../types';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Automatically handle 401 Unauthorized errors (e.g. invalid or expired token)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('admin_token');
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

// ─── Public API ───────────────────────────────────────────

/**
 * Get available calendar days for a given month/pax
 * GET /api/public/reservations/availability/calendar
 */
export async function getAvailableCalendar(year: number, month: number, pax: number) {
  const { data } = await api.get('/public/reservations/availability/calendar', {
    params: { year, month, pax },
  });
  return data.data as { date: string; available: boolean }[];
}

/**
 * Get available time slots for a given date and party size
 * POST /api/public/reservations/availability/times
 */
export async function getAvailableTimes(date: string, pax: number): Promise<TimeSlot[]> {
  const { data } = await api.post('/public/reservations/availability/times', { date, pax });
  const times: string[] = data.data?.times || [];
  return times.map(time => ({ time, available: true }));
}

/**
 * Create a new reservation (public flow)
 * POST /api/public/reservations
 */
export async function createReservation(
  payload: ReservationPayload
): Promise<ReservationConfirmation> {
  const { data } = await api.post('/public/reservations', payload);
  return data.data as ReservationConfirmation;
}

// ─── Auth ────────────────────────────────────────────────

/**
 * Admin login
 * POST /api/auth/login
 */
export async function authLogin(email: string, password: string): Promise<string> {
  const { data } = await api.post('/auth/login', { email, password });
  return data.data.token as string;
}

// ─── Backoffice API ───────────────────────────────────────

/**
 * Get dashboard summary for a given date (defaults to today)
 * GET /api/backoffice/dashboard
 */
export async function getDashboard(date?: string): Promise<DashboardData> {
  const { data } = await api.get('/backoffice/dashboard', { params: date ? { date } : {} });
  return data.data as DashboardData;
}

/**
 * Get list of bookings with optional filters
 * GET /api/backoffice/bookings
 */
export async function getBookings(params?: {
  date?: string;
  status?: BookingStatus;
  search?: string;
  page?: number;
  limit?: number;
}): Promise<{ bookings: Booking[]; total: number }> {
  const { data } = await api.get('/backoffice/bookings', { params });
  return {
    bookings: data.data?.bookings || [],
    total: data.data?.pagination?.total || 0,
  };
}

/**
 * Create a new backoffice reservation
 * POST /api/backoffice/bookings
 */
export async function createBackofficeBooking(payload: any): Promise<Booking> {
  const { data } = await api.post('/backoffice/bookings', payload);
  return data.data as Booking;
}

/**
 * Update a booking's status
 * PATCH /api/backoffice/bookings/:id/status
 */
export async function updateBookingStatus(id: string, status: BookingStatus): Promise<Booking> {
  const { data } = await api.patch(`/backoffice/bookings/${id}/status`, { status });
  return data.data as Booking;
}

/**
 * Get all zones with their tables
 * GET /api/backoffice/zones
 */
export async function getZones(all: boolean = false) {
  const { data } = await api.get('/backoffice/zones', { params: { all } });
  return data.data?.zones || data.data; // Handles the old and new response shape
}

export async function createZone(payload: any) {
  const { data } = await api.post('/backoffice/zones', payload);
  return data.data;
}

export async function updateZone(id: number, payload: any) {
  const { data } = await api.put(`/backoffice/zones/${id}`, payload);
  return data.data;
}

export async function deleteZone(id: number) {
  const { data } = await api.delete(`/backoffice/zones/${id}`);
  return data.data;
}

export async function createTable(zoneId: number, payload: any) {
  const { data } = await api.post(`/backoffice/zones/${zoneId}/tables`, payload);
  return data.data;
}

export async function updateTable(tableId: number, payload: any) {
  const { data } = await api.put(`/backoffice/zones/tables/${tableId}`, payload);
  return data.data;
}

export async function deleteTable(tableId: number) {
  const { data } = await api.delete(`/backoffice/zones/tables/${tableId}`);
  return data.data;
}

export async function getShifts() {
  const { data } = await api.get('/backoffice/shifts');
  return data.data?.shifts || [];
}

export async function updateShift(id: number, payload: any) {
  const { data } = await api.patch(`/backoffice/shifts/${id}`, payload);
  return data.data;
}

export async function getSystemConfig() {
  const { data } = await api.get('/backoffice/config');
  return data.data;
}

export async function updateSystemConfig(payload: any) {
  const { data } = await api.patch('/backoffice/config', payload);
  return data.data;
}

// ─── Customers API ────────────────────────────────────────

/**
 * Get list of customers with optional search and filters
 * GET /api/backoffice/customers
 */
export async function getCustomers(params?: {
  search?: string;
  isVip?: boolean;
  isBlacklisted?: boolean;
  limit?: number;
  page?: number;
}): Promise<{ customers: any[]; total: number }> {
  const { data } = await api.get('/backoffice/customers', { params });
  return {
    customers: data.data?.customers || [],
    total: data.data?.total || 0,
  };
}

/**
 * Get customer details by ID
 * GET /api/backoffice/customers/:id
 */
export async function getCustomerById(id: string): Promise<any> {
  const { data } = await api.get(`/backoffice/customers/${id}`);
  return data.data;
}

/**
 * Update customer profile
 * PATCH /api/backoffice/customers/:id
 */
export async function updateCustomer(
  id: string,
  payload: {
    preferences?: string;
    tags?: string[];
    allergens?: string[];
    birthday?: string;
  }
): Promise<any> {
  const { data } = await api.patch(`/backoffice/customers/${id}`, payload);
  return data.data;
}

/**
 * Add a note to a customer
 * POST /api/backoffice/customers/:id/notes
 */
export async function addCustomerNote(id: string, note: string): Promise<any> {
  const { data } = await api.post(`/backoffice/customers/${id}/notes`, { note });
  return data.data;
}

/**
 * Toggle customer VIP status
 * POST /api/backoffice/customers/:id/vip
 */
export async function toggleCustomerVip(id: string, isVip: boolean): Promise<any> {
  const { data } = await api.post(`/backoffice/customers/${id}/vip`, { isVip });
  return data.data;
}

/**
 * Toggle customer blacklist status
 * POST /api/backoffice/customers/:id/blacklist
 */
export async function toggleCustomerBlacklist(
  id: string,
  blacklist: boolean,
  reason?: string
): Promise<any> {
  const { data } = await api.post(`/backoffice/customers/${id}/blacklist`, {
    blacklist,
    reason,
  });
  return data.data;
}

// ─── Menu API ──────────────────────────────────────────

/**
 * Get public menu
 * GET /api/public/menu
 */
export async function getPublicMenu() {
  const { data } = await api.get('/public/menu');
  return data.data.categories;
}

/**
 * Get public Google reviews
 * GET /api/public/reviews
 */
export async function getReviews() {
  const { data } = await api.get('/public/reviews');
  return data.data;
}

/**
 * Get backoffice menu categories with items
 * GET /api/backoffice/menu/categories
 */
export async function getAdminMenu() {
  const { data } = await api.get('/backoffice/menu/categories');
  return data.data.categories;
}

export async function createMenuCategory(payload: any) {
  const { data } = await api.post('/backoffice/menu/categories', payload);
  return data.data;
}

export async function updateMenuCategory(id: number, payload: any) {
  const { data } = await api.put(`/backoffice/menu/categories/${id}`, payload);
  return data.data;
}

export async function deleteMenuCategory(id: number) {
  const { data } = await api.delete(`/backoffice/menu/categories/${id}`);
  return data.data;
}

export async function createMenuItem(payload: any) {
  const { data } = await api.post('/backoffice/menu/items', payload);
  return data.data;
}

export async function updateMenuItem(id: number, payload: any) {
  const { data } = await api.put(`/backoffice/menu/items/${id}`, payload);
  return data.data;
}

export async function deleteMenuItem(id: number) {
  const { data } = await api.delete(`/backoffice/menu/items/${id}`);
  return data.data;
}

export async function reorderMenuCategories(ids: (number | string)[]) {
  const { data } = await api.post('/backoffice/menu/categories/reorder', { ids });
  return data.data;
}
