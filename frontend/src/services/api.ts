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
