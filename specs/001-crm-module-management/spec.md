# Feature Specification: Customer Management Module

**Feature Branch**: `001-crm-module-management`  
**Created**: April 7, 2026  
**Status**: Draft  
**Input**: User description: "Implement CRM Module (Customer Management) Objective: Create a new section in the admin panel to manage the customer database, leveraging the Customer and CustomerNote models already defined in the Prisma schema. Technical Requirements: Frontend (React): Create a new CustomersPage.tsx in src/pages/admin/. Add a "Customers" link to the existing sidebar/navbar in AdminLayout.tsx. List View: A data table displaying: Full Name, Email, Phone, Total Visits, and Badges for "VIP" or "Blacklisted" status. Search & Filters: Enable searching by name, email, or phone number. Add filters for labels (VIP, Blacklist). Details Modal: When clicking on a customer, open a modal with the following functionalities: View Booking History (dates, pax, and status). Manage Tags & Allergens (multi-select or tag input). Quick Action Buttons: Toggle VIP or Add to Blacklist (requiring a reason). Add and view Internal Staff Notes. Backend (Node/Express): Ensure the following endpoints are available: GET /api/customers: List with filtering and optional pagination. GET /api/customers/:id: Full details including reservation history and notes. PATCH /api/customers/:id: Update customer data (VIP, allergens, etc.). POST /api/customers/:id/notes: Create new internal staff notes for a specific customer. UI/UX: Maintain consistency with the current admin panel design (Card usage, colored status badges, clean typography). Add micro-interactions (table row hover effects, smooth transitions for the modal). Business Logic: If a customer is Blacklisted, the system must show a clear visual warning in the list and prevent new manual backoffice bookings for that user. The totalVisits and totalNoShows counters should be clearly visible and calculated based on their reservation outcomes."

## User Scenarios & Testing *(mandatory)*

<!--
  IMPORTANT: User stories should be PRIORITIZED as user journeys ordered by importance.
  Each user story/journey must be INDEPENDENTLY TESTABLE - meaning if you implement just ONE of them,
  you should still have a viable MVP (Minimum Viable Product) that delivers value.
  
  Assign priorities (P1, P2, P3, etc.) to each story, where P1 is the most critical.
  Think of each story as a standalone slice of functionality that can be:
  - Developed independently
  - Tested independently
  - Deployed independently
  - Demonstrated to users independently
-->

## Constitution Compliance (MANDATORY)

All specifications created from this template MUST declare how the feature complies with the project constitution. At minimum the spec MUST state:

- How input validation will use Joi in the backend (or why it cannot): Backend uses Joi for all API inputs in customerController.js (e.g., note validation, reason for blacklist).
- Any schema changes to `backend/prisma/schema.prisma` and the required migration steps: No schema changes; leverages existing Customer and CustomerNote models. If needed, run `npx prisma migrate dev`.
- Logging and observability requirements (Winston usage) for backend flows: Winston logs all customer operations (searches, updates, notes) in customerService.js.
- Frontend TypeScript conformance (NO `any`) and where API clients will live: Frontend uses TypeScript with proper interfaces in types/index.ts; API clients in services/api.ts.
- Any operational steps required by Docker/compose during deployment: No additional steps; uses existing Docker setup.
- Note: Per project policy, tests are PROHIBITED; do not include test plans.

### User Story 1 - Searchable Customer Global List (Priority: P1)

Staff can view a searchable global list of all customers with key details like name, email, phone, visits, and status badges.

**Why this priority**: This is the core functionality enabling staff to access and overview the customer database efficiently.

**Independent Test**: Can be fully tested by loading the customers page, verifying the list displays, and performing searches without needing other features like details modal.

**Acceptance Scenarios**:

1. **Given** staff is logged in, **When** they access the customers page, **Then** they see a paginated list of customers with Full Name, Email, Phone, Total Visits, and VIP/Blacklisted badges. **Blacklisted rows MUST have a red background for clear identification.**
2. **Given** a customer list is displayed, **When** staff searches by name, email, or phone, **Then** the list filters to matching results in under 0.5 seconds.
3. **Given** filters are applied for VIP or Blacklist, **When** staff toggles them, **Then** the list updates to show only matching customers.

---

### User Story 2 - Manage Allergens and Preferences (Priority: P2)

Staff can view and edit customer preferences, tags, and allergens in a details modal.

**Why this priority**: Allows customization of customer profiles for better service, building on the list view.

**Independent Test**: Can be tested by opening a customer details modal and editing fields without affecting list functionality.

**Acceptance Scenarios**:

1. **Given** a customer is selected from the list, **When** staff opens the details modal, **Then** they see booking history, tags, allergens, and preferences.
2. **Given** in the modal, **When** staff edits tags or allergens, **Then** changes are saved and reflected immediately.
3. **Given** preferences are updated, **When** staff saves, **Then** the backend persists changes without errors.

---

### User Story 3 - Toggle VIP or Blacklist (Priority: P3)

Staff can quickly toggle VIP status or blacklist a customer with a reason, including viewing internal notes.

**Why this priority**: Enables quick actions for customer management, enhancing operational efficiency.

**Independent Test**: Can be tested by toggling statuses in the modal and verifying backend updates without full profile editing.

**Acceptance Scenarios**:

1. **Given** in customer details modal, **When** staff clicks toggle VIP, **Then** the status updates and badge appears in list.
2. **Given** staff chooses to blacklist, **When** they provide a reason, **Then** the customer is blacklisted and new bookings are prevented.
3. **Given** notes section, **When** staff adds a note, **Then** it appears in the modal with timestamp and author.

---

[Add more user stories as needed, each with an assigned priority]

### Edge Cases

- Duplicate email/phone registry: System prevents creating customers with existing email or phone, showing validation error.
- Blacklisted user tries booking: Backend blocks new backoffice bookings for blacklisted customers, frontend shows warning in list.
- Incomplete mandatory profile data: Frontend validates required fields (name, email) before saving updates, backend enforces constraints.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display a data table of customers with Full Name, Email, Phone, Total Visits (including No-shows), and VIP/Blacklisted badges. **Blacklisted rows MUST have a red background for clear identification.**
- **FR-002**: System MUST enable searching customers by name, email, or phone number with real-time filtering.
- **FR-003**: System MUST provide filters for VIP and Blacklisted statuses.
- **FR-004**: System MUST open a details modal on customer row click, showing booking history (dates, pax, status), tags, allergens, preferences.
- **FR-005**: System MUST allow editing tags and allergens in the modal with multi-select inputs.
- **FR-006**: System MUST provide quick action buttons to toggle VIP or blacklist (with reason prompt) in the modal.
- **FR-007**: System MUST display and allow adding internal staff notes in the modal.
- **FR-008**: System MUST prevent new manual backoffice bookings for blacklisted customers.
- **FR-009**: System MUST calculate and display totalVisits and totalNoShows based on reservation outcomes.
- **FR-010**: Backend MUST expose GET /api/customers (list with filters), GET /api/customers/:id (details), PATCH /api/customers/:id (update), POST /api/customers/:id/notes (add note).

### Key Entities *(include if feature involves data)*

- **Customer**: Represents a restaurant customer with attributes like email (unique), phone, firstName, lastName, allergens (array), tags (array), preferences, birthday, totalVisits, totalNoShows, isVip, isBlacklisted, blacklistReason. Related to Bookings and CustomerNotes.
- **CustomerNote**: Internal staff notes on customers, with note text, createdBy (staff name), customerId, createdAt.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Search results load in under 0.5 seconds for up to 10,000 customers.
- **SC-002**: 100% of blacklist actions prevent new bookings for affected customers.
- **SC-003**: Customer details accessible in under 3 clicks from list view.
- **SC-004**: 100% data persistence rate for customer updates and notes.

## Assumptions

- Stable internet connection required for real-time searches and modal interactions.
- Prisma schema remains unchanged; no new migrations needed.
- Admin authentication is active and JWT tokens are valid.
- Responsive design is needed for admin panel on various screen sizes.

## Clarifications

### Session 2026-04-07
- Q: What is the exact name for this feature? → A: Customer Management Module
- Q: What are the three main user stories for the CRM module, in priority order? (Answer as P1: [short desc], P2: [short desc], P3: [short desc], each <=5 words) → A: P1: Searchable Customer Global List P2: Manage Allergens and Preferences P3: Toggle VIP or Blacklist
- Q: What are 2-3 key edge cases for the CRM module? (List them, each <=5 words) → A: EC1: Duplicate email/phone registry EC2: Blacklisted user tries booking EC3: Incomplete mandatory profile data
- Q: What are the measurable success criteria for the CRM module? (List 2-3 as SC-001: [metric], each <=5 words) → A: SC-001: Search results in <0.5s SC-002: 100% blacklist block rate SC-003: Details in <3 clicks SC-004: 100% data persistence rate
- Q: What are key assumptions for the CRM module? (List 2-3, each <=5 words) → A: AS1: Stable internet connection required AS2: Prisma schema remains unchanged AS3: Admin authentication is active AS4: Responsive design is needed
