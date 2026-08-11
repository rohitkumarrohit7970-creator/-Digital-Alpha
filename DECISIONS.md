# Architecture & Design Decisions

This document outlines the core technical decisions made to satisfy the strict requirements of the Digital Alpha Technologies assignment.

### 1. Database & ORM Stack
- **PostgreSQL**: Selected as the database for its robust JSON handling and native support for aggressive row-level locking, which was a critical requirement for the rewards redemption engine.
- **SQLAlchemy with Pydantic**: SQLAlchemy provides the ORM mapping, while Pydantic schemas enforce strict data validation on the API boundary, guaranteeing that the frontend receives highly predictable types.

### 2. Frontend Framework & State
- **Next.js 15 (App Router)**: Used to construct the frontend shell. While this assignment is highly client-interactive (rendering TanStack Query ideal), Next.js provides the optimal build pipeline, layout architecture, and routing wrapper.
- **TanStack React Query**: chosen over native Next.js server actions or standard `useEffect` fetching because of its phenomenal client-side caching, loading state primitives (`isPending`), and most importantly, query invalidation. When a user redeems a reward, a single `invalidateQueries(["balance"])` call instantly triggers a safe refetch of the database balance, keeping the UI perfectly in sync without manual math.

### 3. Custom Transaction Table (Zero Data-Grid Libraries)
- **Strictly Custom Implementation**: As requested, absolutely no third-party table libraries (AG Grid, MUI, TanStack Table) were used. The table was built from scratch using raw semantic HTML (`<table>`, `<thead>`, `<tbody>`).
- **Responsive Table Strategy**: Standard HTML tables break catastrophically on mobile viewports. To solve this, the table component utilizes responsive CSS breakpoints (`hidden md:block` for the table, `block md:hidden` for a flex column). On mobile, the 10,000 rows render as a stack of highly readable UI cards rather than a squished unreadable grid.

### 4. Server-Side Data Delegation
- **Server-Side Pagination & Analytics**: The assignment explicitly prohibited downloading 10,000 JSON records into the browser to be filtered by React. All aggregations (e.g., Monthly Spending Trends, Category groupings) and pagination happen at the PostgreSQL level via FastAPI endpoints (`/api/analytics/monthly`), returning lightweight, pre-computed JSON directly into Recharts.

### 5. Atomic Redemption Architecture
- **Row-Level Locking**: The most critical business decision was preventing double-spending in the `/api/rewards/{reward_id}/redeem` endpoint.
- **Implementation**: I utilized SQLAlchemy's `.with_for_update()` which emits a strict `SELECT ... FOR UPDATE` query to PostgreSQL. This locks the specific user's row. If 5 concurrent API requests hit the server simultaneously, 4 will queue at the database level while the 1st request reads the balance, deducts it, inserts the redemption record, and securely commits the transaction. If any step fails, `db.rollback()` guarantees the state is completely reset.

### 6. Deployment Strategy
- **Platform Choice**: Vercel for the Next.js frontend (zero-config, high edge performance) and Render for the FastAPI backend (seamless Python Docker/native support with PostgreSQL integration).
- **Environment Separation**: Secure variables are managed via `.env` (ignored in Git) with `.env.example` provided for rapid local setup. CORS is configured dynamically via the `FRONTEND_URL` environment variable to ensure secure communication between the deployed instances.
