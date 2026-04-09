# Data Model: Real-time reservation notification feature

## No Prisma schema changes required

This feature does not introduce new database entities or alter existing models. It reuses the current booking model and staff authentication model.

## Event contract: NewReservationSocketEvent

- `event`: `new_reservation`
- `payload`: object
  - `id`: string
  - `date`: string (ISO 8601 date-time)
  - `pax`: number
  - `status`: string
  - `tableName`: string | null
  - `zoneName`: string | null
  - `customerName`: string
  - `customerEmail`: string

## Runtime session entity: AdminSocketSession

- `socketId`: string
- `userId`: string
- `email`: string
- `role`: string
- `connectedAt`: string
- `room`: `backoffice`

## Relationships

- A `NewReservationSocketEvent` is emitted in response to a successful `Booking` creation.
- `AdminSocketSession` is derived from the authenticated `staff` JWT payload.
