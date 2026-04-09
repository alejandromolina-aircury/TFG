# Quickstart: Real-time reservation alert feature

## Install dependencies

Backend:
```bash
cd backend
npm install socket.io
```

Frontend:
```bash
cd frontend
npm install socket.io-client
```

## Environment

Ensure frontend URL is available in the backend environment:
- `FRONTEND_URL=http://localhost:5173`
- `JWT_SECRET` must be set in backend `.env`

## Run locally

Backend:
```bash
cd backend
npm run dev
```

Frontend:
```bash
cd frontend
npm run dev
```

## Verify the feature

1. Log in to `/admin/login` and open the admin dashboard.
2. Create a public reservation through the customer-facing reservation page.
3. Confirm the admin dashboard receives a `new_reservation` notification and refreshes relevant data without a full reload.

## Docker / deployment notes

- No database migration is required for this feature.
- Rebuild images after dependency installation:
```bash
docker-compose build backend frontend
```
- Start the stack with:
```bash
docker-compose up -d
```
