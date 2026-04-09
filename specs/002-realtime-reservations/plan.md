# Implementation Plan: Real-time reservation alerts for admin dashboard

**Branch**: `002-realtime-reservations` | **Date**: 2026-04-09 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/002-realtime-reservations/spec.md`

## Summary

Add real-time reservation notifications for the admin dashboard by introducing Socket.io to the existing Express backend and React frontend. The backend will emit a `new_reservation` event after Prisma persists a new public booking, and authenticated admin clients will receive the event through a centralized socket provider.

## Technical Context

**Language/Version**: Node.js 18+ on backend, React 19 with TypeScript 5.9 on frontend
**Primary Dependencies**: Express.js v4, Prisma 6, React 19, Vite, Axios, Joi, `socket.io`, `socket.io-client`
**Storage**: PostgreSQL via Prisma Client
**Testing**: No formal tests (project policy prohibits tests)
**Target Platform**: Linux server for backend, modern browsers for frontend admin UI
**Project Type**: Web application with backend API and frontend SPA
**Performance Goals**: <3 second notification latency from booking save to admin notification; update UI without full page reload
**Constraints**: Must reuse existing JWT auth and no Prisma schema changes; must not use raw SQL; must maintain Routes → Controllers → Services structure
**Scale/Scope**: Single restaurant reservation system, focused on live admin alerting for new bookings

## Constitution Check

- Backend validation: Booking creation continues using existing Joi-based validation services in `backend/src/services/validationService.js`.
- Database: No `backend/prisma/schema.prisma` change is required for this feature; therefore no migration step is needed.
- Logging: Socket auth, connection events, and emission failures will be logged using the current backend logging conventions (console/Winston style) in `backend/src/socketManager.js` and reservation controller.
- Frontend: TypeScript will be used in all new files. API client logic remains centralized in `frontend/src/services/api.ts` and new socket connection logic will live in `frontend/src/context/SocketContext.tsx`.
- Infrastructure: Docker compose files are present at `docker-compose.yml` and `docker-compose.prod.yml`; no structural infra changes are required beyond rebuilding containers after dependency install.
- Security: Admin sockets authenticate via existing JWT `admin_token`; the handshake uses the same JWT_SECRET as `backend/src/controllers/authController.js`.
- Prohibitions: No raw SQL. No tests will be added.

**Gate status**: PASS. No constitution violations are introduced by this feature.

## Project Structure

backend/
├── src/
│   ├── index.js
│   ├── controllers/
│   │   ├── public/
│   │   │   └── reservationController.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   └── services/
│       └── validationService.js
frontend/
├── src/
│   ├── components/
│   ├── context/
│   │   └── SocketContext.tsx  # new
│   ├── pages/admin/
│   │   ├── DashboardPage.tsx
│   │   ├── ReservasPage.tsx
│   │   ├── AdminLayout.tsx
│   │   └── LoginPage.tsx
│   └── services/
│       └── api.ts

**Structure Decision**: This is a web application with a separate backend API and frontend SPA. Existing source tree is preserved; new socket-specific logic will live in backend `socketManager.js` and frontend `context/`.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None | N/A | N/A |
