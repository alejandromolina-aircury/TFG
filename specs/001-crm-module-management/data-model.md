# Data Model: Customer Management Module

## Entities

### Customer
**Purpose**: Represents a restaurant customer with CRM data.

**Fields**:
- id: String (UUID, primary key)
- email: String (unique)
- phone: String
- firstName: String
- lastName: String
- language: Language enum (ES, EN, FR)
- allergens: String[] (array of strings)
- tags: String[] (array of strings, e.g., VIP, Blacklist)
- preferences: String? (optional notes)
- birthday: DateTime?
- totalVisits: Int (default 0)
- totalNoShows: Int (default 0)
- isVip: Boolean (default false)
- isBlacklisted: Boolean (default false)
- blacklistReason: String?
- createdAt: DateTime
- updatedAt: DateTime

**Relationships**:
- bookings: Booking[] (one-to-many)
- waitlist: Waitlist[] (one-to-many)
- notes: CustomerNote[] (one-to-many)

**Validation Rules**:
- Email: Required, valid format, unique
- Phone: Optional, but if provided, valid format
- FirstName/LastName: Required for display
- Allergens/Tags: Arrays of strings, no duplicates
- TotalVisits/TotalNoShows: Calculated from bookings, >=0
- IsVip/IsBlacklisted: Boolean, mutually exclusive in UI but not enforced
- BlacklistReason: Required if isBlacklisted=true

**State Transitions**:
- VIP: Toggle via API, updates tags array
- Blacklist: Toggle via API, requires reason, prevents bookings

### CustomerNote
**Purpose**: Internal staff notes on customers.

**Fields**:
- id: String (UUID, primary key)
- note: String (required)
- createdBy: String (staff name)
- customerId: String (foreign key to Customer)
- createdAt: DateTime

**Relationships**:
- customer: Customer (many-to-one)

**Validation Rules**:
- Note: Required, non-empty
- CreatedBy: Required, from authenticated staff
- CustomerId: Must exist

## Business Logic
- Visits/No-shows: Calculated from Booking.status (COMPLETED for visits, NO_SHOW for no-shows)
- Blacklist Prevention: Backend blocks backoffice bookings if isBlacklisted=true
- Tags Sync: VIP/Blacklist tags auto-managed with flags