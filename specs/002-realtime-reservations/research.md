# Research: Socket.io real-time reservation alerts

## Decision

Use Socket.io as the real-time transport layer and integrate it as an addition to the existing Express backend. A centralized backend `socketManager.js` will manage connections, authentication, room joining, and event emission. On the frontend, a `SocketContext` provider and `useSocket` hook will provide a single socket instance for admin pages.

## Rationale

- Socket.io is the best fit for the existing Express stack and supports JWT handshake authentication and room-based delivery.
- It avoids adding a separate polling flow or a heavier external messaging layer.
- Using a centralized socket manager keeps controllers thin and preserves the Routes → Controllers → Services architecture.
- The admin session already relies on JWT stored in `localStorage`, making socket auth straightforward.
- No Prisma schema change is needed because this is an event notification feature, not a data modeling change.

## Alternatives Considered

- **Polling**: Rejected because it is inefficient and does not provide instant alerts.
- **Server-Sent Events (SSE)**: Rejected because Socket.io offers reliable cross-browser fallback behavior and easier room/auth handling.
- **Third-party realtime service**: Rejected because it introduces operational complexity, external dependencies, and is unnecessary for a single-site admin feature.

## Implementation Notes

- Backend: Use `http.createServer(app)` and initialize Socket.io after Express middleware and routes are declared.
- Frontend: Connect only when `admin_token` exists, and disconnect on logout.
- Event payload should contain booking metadata necessary for UI refresh: id, date, time, pax, table, customer name, status.
