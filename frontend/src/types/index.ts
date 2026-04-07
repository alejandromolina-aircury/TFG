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
  blacklistReason?: string;
  allergens: string[];
  tags: string[];
  preferences?: string;
  birthday?: string;
  language: 'ES' | 'EN' | 'FR';
  totalVisits: number;
  totalNoShows: number;
  createdAt: string;
  updatedAt: string;
  notes?: Array<{
    id: string;
    note: string;
    createdBy: string;
    createdAt: string;
  }>;
  bookings?: Booking[];
  waitlist?: Array<{
    id: string;
    date: string;
    pax: number;
    notes?: string;
    isResolved: boolean;
  }>;
  stats?: {
    totalBookings: number;
    completed: number;
    cancelled: number;
    noShows: number;
    upcoming: number;
    loyaltyRate: number;
    avgDaysBetweenVisits: number;
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  };
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
