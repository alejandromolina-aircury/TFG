// frontend/src/types/index.ts

export type BookingStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'RECONFIRMED'
  | 'SEATED'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'NO_SHOW';

export type BookingSource = 'WEB' | 'PHONE' | 'WALK_IN' | 'BACKOFFICE';

export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  isVip: boolean;
  isBlacklisted: boolean;
  allergens: string[];
  totalVisits: number;
  totalNoShows: number;
}

export interface Zone {
  id: number;
  name: string;
  description?: string;
  isActive: boolean;
}

export interface Table {
  id: number;
  name: string;
  minCapacity: number;
  maxCapacity: number;
  isActive: boolean;
  zone: Zone;
}

export interface Booking {
  id: string;
  date: string;
  duration: number;
  pax: number;
  status: BookingStatus;
  source: BookingSource;
  specialRequests?: string;
  customer: Customer;
  table?: Table;
  createdAt: string;
  confirmedAt?: string;
}

export interface DashboardSummary {
  totalBookings: number;
  activeBookings: number;
  totalPaxExpected: number;
  totalTables: number;
  occupancyRate: number;
  upcomingNext7Days: number;
}

export interface DashboardData {
  date: string;
  summary: DashboardSummary;
  statusCounts: Partial<Record<BookingStatus, number>>;
  bookings: Booking[];
}

export interface TimeSlot {
  time: string;
  available: boolean;
  availableTables?: number;
}

export interface ReservationPayload {
  date: string;
  time: string;
  pax: number;
  zoneId?: number;
  specialRequests?: string;
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
}

export interface ReservationConfirmation {
  booking: {
    id: string;
    confirmationCode: string;
    date: string;
    pax: number;
    duration: string;
    status: BookingStatus;
  };
  customer: {
    name: string;
    email: string;
    isReturningCustomer: boolean;
  };
  table: {
    name: string;
    zone?: string;
    note?: string;
  };
}
