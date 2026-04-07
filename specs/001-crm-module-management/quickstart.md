# Quickstart: Customer Management Module

## Prerequisites
- Docker and Docker Compose installed
- Node.js 18+ (for local development)
- PostgreSQL (handled by Docker)

## Setup
1. Clone the repository and navigate to the project root.
2. Run `docker-compose up -d` to start the database and services.
3. Run `npm install` in both `backend/` and `frontend/` directories.
4. In `backend/`, run `npx prisma migrate deploy` to apply migrations.
5. In `backend/`, run `npx prisma db seed` to populate sample data.
6. Start the backend: `npm run dev` in `backend/`.
7. Start the frontend: `npm run dev` in `frontend/`.

## Accessing the CRM Module
1. Open the frontend at `http://localhost:5173`.
2. Navigate to `/admin/login` and log in with admin credentials.
3. Click "Customers" in the sidebar to access the CRM page.

## Testing the Module
### Backend API Testing
Use tools like Postman or curl to test endpoints:

- **List Customers**: GET `http://localhost:3000/api/customers?page=1&limit=10&search=john`
- **Customer Details**: GET `http://localhost:3000/api/customers/{id}`
- **Update Customer**: PATCH `http://localhost:3000/api/customers/{id}` with JSON body
- **Add Note**: POST `http://localhost:3000/api/customers/{id}/notes` with `{"note": "Sample note"}`

Include `Authorization: Bearer <token>` header for authenticated requests.

### Frontend Testing
- Search customers by name/email/phone.
- Apply filters (VIP, Blacklist, Tags).
- Open customer details modal.
- Edit preferences, allergens, tags.
- Toggle VIP/Blacklist status.
- Add internal notes.

## Sample Data
The seed script creates sample customers with various statuses for testing.

## Troubleshooting
- Ensure database is running: `docker ps`.
- Check logs: `docker-compose logs backend`.
- Reset database: `docker-compose down -v && docker-compose up -d` then re-run migrations and seed.