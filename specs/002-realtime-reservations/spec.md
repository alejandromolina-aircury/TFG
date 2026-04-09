# Feature Specification: Real-time reservation alerts for admin dashboard

**Feature Branch**: `002-realtime-reservations`  
**Created**: 2026-04-09  
**Status**: Draft  
**Input**: User description: "I want to add real-time capabilities to my restaurant reservation system using Socket.io. The goal is to notify the Admin Dashboard instantly whenever a new reservation is made by a client."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Admin dashboard receives instant reservation alerts (Priority: P1)

An authenticated back-office user has the admin dashboard open. When a client completes a public reservation, the dashboard receives a live `new_reservation` notification immediately and updates the displayed summary.

**Why this priority**: This delivers the core value of the feature by making admin staff aware of new bookings as they happen, improving response speed and reducing the need for manual refresh.

**Independent Test**: Create a public reservation while the admin dashboard is open and verify the notification appears without a manual page reload.

**Acceptance Scenarios**:

1. **Given** an authenticated admin is on the dashboard, **When** the public reservation endpoint successfully creates a booking, **Then** the admin receives a `new_reservation` event and sees a notification.
2. **Given** the dashboard received a `new_reservation` event, **When** the event is processed, **Then** the local dashboard state refreshes or merges the new booking data without a full browser reload.

---

### User Story 2 - Reservas page refreshes on live reservation arrival (Priority: P2)

An authenticated back-office user is viewing the reservation list. When a client books a new table via the public flow, the reservation list auto-refreshes and indicates that new data arrived.

**Why this priority**: Supporting the booking management screen prevents stale data during active service periods and keeps back-office staff aligned with new arrivals.

**Independent Test**: Open `/admin/reservas`, create a new public reservation, and verify the list refreshes automatically and a notification appears.

**Acceptance Scenarios**:

1. **Given** an authenticated admin is on the reservations page, **When** a new reservation is received through Socket.io, **Then** the page refreshes its listing data without requiring a hard reload.

---

### User Story 3 - Admin socket connects only when authenticated (Priority: P3)

The system connects the admin socket only after a valid `admin_token` is present and disconnects it when the admin logs out.

**Why this priority**: Secure socket access is required to prevent unauthorized back-office notifications and to avoid idle connections for unauthenticated visitors.

**Independent Test**: Log in as admin and verify the socket connects; log out and verify the socket disconnects.

**Acceptance Scenarios**:

1. **Given** a valid `admin_token` in localStorage, **When** the admin area loads, **Then** the socket provider initializes and joins the `backoffice` room.
2. **Given** the admin logs out, **When** `admin_token` is removed, **Then** the socket disconnects immediately.

---

### Edge Cases

- What happens when the socket connection fails due to invalid or expired JWT? The admin UI should continue functioning with standard REST polling and display a small warning if live updates are unavailable.
- How does the system handle a successful booking save when socket emission fails? The reservation creation response must remain successful, and the backend should log the emission failure without blocking the client.
- What happens when an admin is connected but not on an admin page? The socket should remain connected only while the admin session is active, and reconnection should occur after navigating back to admin routes.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Backend MUST install and configure `socket.io` so the Express server uses `http.createServer(app)` and a shared Socket.io instance.
- **FR-002**: Backend MUST implement a centralized `socketManager.js` utility to initialize Socket.io with CORS configured for the frontend URL and to manage connections and disconnections.
- **FR-003**: Backend MUST authenticate WebSocket handshake requests using the existing JWT secret and allow only authenticated admin/staff sockets to join a `backoffice` room.
- **FR-004**: Backend MUST emit a `new_reservation` event from the public reservation creation flow immediately after a booking is successfully saved to Prisma.
- **FR-005**: Frontend MUST install `socket.io-client` and create a `SocketContext` with a `SocketProvider` and `useSocket` hook for centralized connection management.
- **FR-006**: Frontend MUST auto-connect Socket.io when `admin_token` exists and disconnect when the admin logs out or the session ends.
- **FR-007**: `DashboardPage.tsx` and `ReservasPage.tsx` MUST listen for `new_reservation` and refresh local UI state without a full page reload.
- **FR-008**: Backend validation MUST continue using existing Joi-based validation services for reservation data; no reservation input validation logic should be duplicated in the socket flow.
- **FR-009**: No changes to `backend/prisma/schema.prisma` are required for this feature; the implementation must reuse the existing booking data model.
- **FR-010**: Backend socket events and failures MUST be logged using the existing logging approach (Winston or standardized console logging) for observability.

### Key Entities *(include if feature involves data)*

- **Reservation event**: Represents a newly created booking payload delivered to admin clients. Key attributes include booking ID, date/time, party size, customer name, table name, and status.
- **Admin socket session**: Represents an authenticated WebSocket connection identified by `admin_token` JWT, joined to the `backoffice` room for receiving live booking events.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: An authenticated admin user receives a `new_reservation` notification within 3 seconds after a public reservation is successfully created.
- **SC-002**: The dashboard or reservations list updates to include the new booking without requiring a browser refresh in at least 90% of normal use cases.
- **SC-003**: The frontend socket provider connects automatically after login and disconnects on logout for 100% of admin sessions.
- **SC-004**: Invalid or missing `admin_token` prevents a socket from joining the `backoffice` room; unauthorized socket connections are rejected.
- **SC-005**: Backend reservation creation remains successful even if socket emission fails, while the failure is recorded in server logs.

## Assumptions

- Existing admin authentication will be reused with the current JWT stored in `localStorage` as `admin_token`.
- No Prisma schema migration is needed because the feature uses current booking and staff models.
- The frontend will use the existing `frontend/src/services/api.ts` client layer and a new `SocketContext` for socket state.
- Docker/compose deployment will not require runtime changes beyond rebuilding the backend and frontend images after dependency installation.
- Notification UI can use a small toast or inline banner; adding `react-hot-toast` is optional but not required for the first implementation.
