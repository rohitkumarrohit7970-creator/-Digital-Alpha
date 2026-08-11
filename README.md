# Digital Alpha Technologies - Full Stack Assignment

A premium, modern fintech dashboard built with Next.js, FastAPI, and PostgreSQL. It demonstrates highly performant data-grids, real-time filtering, data visualization, and an atomic rewards redemption backend.

## Deployment Links
- **GitHub Repository**: [Your GitHub Repo URL]
- **Frontend Live URL**: [Your Vercel URL]
- **Backend API URL**: [Your Render/Fly URL]

## Features
- **Server-Side Data Grid**: A completely custom, zero-dependency data table supporting pagination, sorting, and multi-parameter filtering of 10,000 transaction records.
- **Data Visualization**: Dynamic Spending and Category charts using Recharts that update in sync with the current database state.
- **Rewards Engine**: A fully operational backend rewards system that leverages database row-level locking (`SELECT ... FOR UPDATE`) to guarantee zero double-spending or race conditions.
- **Premium UI/UX**: Built using Tailwind CSS, featuring subtle micro-animations, glassmorphism, responsive collapsible filters, and comprehensive accessibility (a11y) support.

## Architecture & Technology Stack
### Frontend
- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS
- TanStack React Query (Server state management & caching)
- Recharts (Analytics)
- Lucide React (Iconography)

### Backend
- Python 3
- FastAPI (High-performance API framework)
- Pydantic (Data validation)
- SQLAlchemy (ORM)
- PostgreSQL (Primary database)
- Pytest (Testing suite)

## Prerequisites
- Node.js (v18+)
- Python (v3.10+)
- PostgreSQL (v16+)

---

## Setup Instructions

The setup should take less than 5 minutes.

### 1. Environment Variables
Copy the example environment file in the project root:
```bash
cp .env.example .env
```
Update the `DATABASE_URL` in `.env` if your local PostgreSQL credentials differ from the default (`postgres:postgres@localhost:5432`).

### 2. PostgreSQL Database Setup
Ensure PostgreSQL is running and create the target database:
```bash
psql -U postgres -c "CREATE DATABASE alphatech;"
```

### 3. Backend Setup
Navigate to the `backend` directory, create a virtual environment, and install dependencies:
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### 4. Seed the Database
With the virtual environment active, run the seed script to parse the `transactions.json` dataset and populate PostgreSQL (this calculates your starting coin balance based on the 10,000 transactions):
```bash
PYTHONPATH=. python scripts/seed.py
```

### 5. Start the Backend Server
Run the FastAPI application:
```bash
uvicorn app.main:app --host 0.0.0.0 --port 8081 --reload
```
The backend will run at `http://localhost:8081`. You can view the automatic Swagger documentation at `http://localhost:8081/docs`.

### 6. Frontend Setup & Start
Open a new terminal, navigate to the `frontend` directory, install dependencies, and run the development server:
```bash
cd frontend
npm install
npm run dev
```
The dashboard will run at `http://localhost:3000`.

---

## Testing
To run the backend tests (verifying atomic redemption and API logic):
```bash
cd backend
source venv/bin/activate
PYTHONPATH=. pytest tests/
```

---

## Known Issues / Not Done
- **Authentication**: A static user (`USER_001`) is used for the demo. No JWT or OAuth is implemented.
- **Dark Mode Toggle**: The app is hardcoded into an aesthetic dark mode to fit the premium fintech prompt; a light-mode switch was omitted for time.
- **Advanced Chart Interactivity**: The donut chart supports basic click-to-filter, but tooltips and drill-down views are minimal.
