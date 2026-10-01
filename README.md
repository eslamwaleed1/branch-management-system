# Branch Management System

A responsive, role-oriented business dashboard for managing a company with multiple branches. The React frontend reads and creates business records through an Express REST API hosted on Render; the backend connects to MongoDB Atlas for persistent storage.

## Features

- **CEO workspace:** company-wide and branch-specific dashboards, branch navigation, sales and revenue summaries, trend charts, recent transactions, and access to employees, clients, inventory, and sales.
- **Regional manager workspace:** branch-scoped dashboard and views for employees, clients, inventory, and sales, with forms for adding supported records.
- **Sales representative workspace:** view a representative's sales and record a new sale.
- **Business records:** browse branches, employees, clients, products/inventory, and sales. Forms are provided to create branches, employees, clients, products, and sales.
- **Data presentation:** table views for operational data; employee and client card/board views where available; search and branch filtering on supported lists; employee detail and edit dialogs.
- **Dashboard analytics:** select day, month, quarter, or year periods for sales/revenue comparisons and visual trends. Profit is currently estimated as 25% of revenue in the frontend, rather than read from a stored profit field.
- **Usability:** light/dark theme toggle, route-level lazy loading, loading and error states, and layouts that adapt to narrow and wide screens. Tables and boards can scroll horizontally on smaller screens.

The onboarding screen is a view-mode selector for exploring the role workspaces; it is not an authentication or authorization system.

## Architecture and data flow

```text
React + Vite frontend
	| HTTPS / JSON API requests
	v
Express backend hosted on Render
	| MongoDB driver connection
	v
MongoDB Atlas
```

The browser communicates with the Express API only; MongoDB credentials and database access belong on the backend and are not exposed to the frontend. The API client is centralized in `src/lib/api.js`. Its current base URL points to the deployed Render service at `https://branch-management-system-backend-express.onrender.com/api`.

The frontend currently requests these collections with `GET`:

- `/branches`
- `/employees`
- `/clients`
- `/sales`
- `/products`

Creation forms send JSON `POST` requests to the corresponding collection endpoint. TanStack React Query caches collection responses, retries a failed request once, and invalidates the relevant collection after a successful create. Branch-specific pages scope the retrieved records to the selected branch.

At present, the shared API client implements collection reads and creates. UI edit controls should not be assumed to persist changes unless the matching update endpoint and request are implemented in the frontend and backend. Authentication, authorization, and server-side role enforcement are also outside the current frontend flow.

## Scalability and responsive design

The frontend separates routing, role-specific pages, reusable entity components, data hooks, and the API client. Route-level lazy loading keeps page code split into smaller bundles, while the shared query cache avoids unnecessary repeat requests and lets mutations refresh the affected data. The backend/database boundary keeps persistence and secrets out of the browser and allows the API and database to be scaled independently as usage grows. These are architectural foundations, not a guarantee of capacity without backend sizing, monitoring, and load testing.

Responsive layouts use breakpoint-based grids and spacing, flexible content widths, and horizontally scrollable data tables and boards. This keeps dashboards and record workflows usable across phone, tablet, and desktop screen sizes.

## Run locally

Requirements: Node.js and npm.

```bash
npm install
npm run dev
```

The development server prints its local URL. The frontend uses the configured Render API by default; change `API_BASE_URL` in `src/lib/api.js` to point at another API environment.

## Checks

```bash
npm run lint
npm run build
```