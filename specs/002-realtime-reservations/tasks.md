# Tasks: Real-time reservation alerts for admin dashboard

**Input**: Design documents from `/specs/002-realtime-reservations/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare the codebase for Socket.io and frontend socket state.

- [x] T001 [P] Add backend Socket.io dependency in `backend/package.json` and install `socket.io`
- [x] T002 [P] Add frontend Socket.io client dependency in `frontend/package.json` and install `socket.io-client`
- [x] T003 [P] Create new backend socket manager utility in `backend/src/socketManager.js`
- [x] T004 [P] Create new frontend socket context file in `frontend/src/context/SocketContext.tsx`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Implement core socket server startup, auth, and admin socket lifecycle.

- [x] T005 Refactor `backend/src/index.js` to start the server with `http.createServer(app)` and initialize Socket.io from `backend/src/socketManager.js`
- [x] T006 Implement JWT-authenticated Socket.io handshake logic in `backend/src/socketManager.js` and join authenticated sockets to the `backoffice` room
- [x] T007 Export a reusable backend emit helper from `backend/src/socketManager.js` for controller event emission
- [x] T008 Implement `SocketProvider` and `useSocket` in `frontend/src/context/SocketContext.tsx` to connect when `admin_token` exists and disconnect on cleanup
- [x] T009 Update `frontend/src/App.tsx` or `frontend/src/pages/admin/AdminLayout.tsx` to wrap protected admin routes with `SocketProvider`
- [x] T010 Update `frontend/src/pages/admin/AdminLayout.tsx` logout flow to remove `admin_token` and allow the admin socket to disconnect cleanly

---

## Phase 3: User Story 1 - Admin dashboard receives instant reservation alerts (Priority: P1)

**Goal**: Emit live reservation events from the backend and update the admin dashboard immediately.

**Independent Test**: With the admin dashboard open, create a new public reservation and verify a live notification appears and the dashboard data refreshes without a full page reload.

### Implementation for User Story 1

- [x] T011 [US1] Update `backend/src/controllers/public/reservationController.js` to emit a `new_reservation` event after a booking is successfully created
- [x] T012 [US1] Ensure the event payload from `backend/src/controllers/public/reservationController.js` includes booking id, date, pax, status, table name, zone name, customer name, and customer email
- [x] T013 [US1] Update `frontend/src/pages/admin/DashboardPage.tsx` to subscribe to `new_reservation` using `useSocket()` and refresh dashboard state on arrival
- [x] T014 [US1] Add notification UI inside `frontend/src/pages/admin/DashboardPage.tsx` to surface new reservation arrivals to admin users without reloading the page

---

## Phase 4: User Story 2 - Reservas page refreshes on live reservation arrival (Priority: P2)

**Goal**: Keep the admin reservation list fresh by refreshing bookings when a new public reservation arrives.

**Independent Test**: With `/admin/reservas` open, create a public reservation and verify the reservation list refreshes automatically and the admin sees a live update indicator.

### Implementation for User Story 2

- [x] T015 [US2] Update `frontend/src/pages/admin/ReservasPage.tsx` to subscribe to `new_reservation` using `useSocket()`
- [x] T016 [US2] Refresh the bookings list inside `frontend/src/pages/admin/ReservasPage.tsx` when the `new_reservation` event arrives
- [x] T017 [US2] Add an inline notification or banner in `frontend/src/pages/admin/ReservasPage.tsx` indicating that new reservation data has arrived

---

## Phase 5: User Story 3 - Admin socket connects only when authenticated (Priority: P3)

**Goal**: Secure the admin socket lifecycle so only authenticated admin users connect and the socket disconnects on logout.

**Independent Test**: Log in to the admin area and confirm the socket connects; log out and confirm the socket disconnects.

### Implementation for User Story 3

- [x] T018 [US3] Ensure `frontend/src/context/SocketContext.tsx` only initializes the socket when `admin_token` exists in `localStorage`
- [x] T019 [US3] Implement cleanup in `frontend/src/context/SocketContext.tsx` so the socket disconnects when the provider unmounts or token is removed
- [x] T020 [US3] Add socket authentication failure handling in `frontend/src/context/SocketContext.tsx` so invalid/expired JWTs do not break the admin app

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final integration, documentation, and operational readiness.

- [x] T021 [P] Document the Socket.io setup and admin realtime behavior in `specs/002-realtime-reservations/quickstart.md`
- [x] T022 [P] Verify backend socket errors are logged in `backend/src/socketManager.js` and reservation controller export paths
- [x] T023 [P] Verify frontend socket provider uses TypeScript without `any` and does not degrade the existing admin route flow
- [x] T024 [P] Update `specs/002-realtime-reservations/plan.md` or `specs/002-realtime-reservations/research.md` only if implementation details diverge from the original design

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Can begin immediately and can run in parallel
- **Foundational (Phase 2)**: Depends on Setup completion; blocks user stories until complete
- **User Stories (Phase 3+)**: Depend on Foundational completion; may proceed in parallel after that point
- **Polish (Phase 6)**: Depends on all user stories being implemented

### User Story Dependencies

- **User Story 1 (P1)**: Implementation depends on the foundational socket server and provider being in place
- **User Story 2 (P2)**: Implementation depends on the socket provider and dashboard socket flow
- **User Story 3 (P3)**: Implementation depends on the new `SocketContext` and admin route wrapper

### Parallel Opportunities

- `T001`, `T002`, `T003`, `T004` are parallelizable
- `T006`, `T007`, `T008`, `T009`, `T010` are parallelizable after `T005`
- `T013` and `T015` can be implemented in parallel once the socket provider is available
- `T018`, `T019`, and `T020` can be implemented in parallel with User Story 1 or 2 once the provider blueprint exists

---

## Implementation Strategy

### MVP First

1. Complete Phase 1 and Phase 2 foundational socket setup
2. Implement User Story 1 for the dashboard notification flow
3. Validate the dashboard receives `new_reservation` events and refreshes state
4. Continue with User Story 2 and User Story 3

### Incremental Delivery

- Finish foundational setup before any user story work
- Deliver the admin dashboard socket flow first as the MVP
- Add the reservas page live refresh next
- Harden authentication and cleanup behavior last

### Notes

- No tests are included in this task list due to project policy
- Tasks are organized by story to preserve independent implementability
- Use exact file paths and keep backend controller logic separate from socket manager logic
